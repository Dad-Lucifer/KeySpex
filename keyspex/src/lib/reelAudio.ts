// ============================================================================
// REEL WEB AUDIO SYNTHESIZER
// ============================================================================
// Synthesizes pleasant, low-latency audio loops for reel hover & long-press
// interactions without requiring external audio asset downloads.
// ============================================================================

export type ReelTheme = "fashion" | "cafe" | "skincare"

interface ActiveAudioSession {
  context: AudioContext
  stop: () => void
}

export function playReelAudio(theme: ReelTheme = "fashion"): ActiveAudioSession | null {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return null

    const ctx = new AudioContextClass()
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {})
    }

    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0.01, ctx.currentTime)
    // Smooth fade in to a comfortable volume
    masterGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.12)
    masterGain.connect(ctx.destination)

    const timers: number[] = []
    const oscillators: OscillatorNode[] = []

    if (theme === "fashion") {
      // ── Fashion: Modern kinetic electronic pulse (120 BPM) ────────────────
      const notes = [130.81, 146.83, 164.81, 196.0] // C3, D3, E3, G3
      let step = 0

      const tick = () => {
        if (ctx.state === "closed") return

        // Bass synth note
        const osc = ctx.createOscillator()
        const noteGain = ctx.createGain()
        osc.type = "sawtooth"
        osc.frequency.setValueAtTime(notes[step % notes.length], ctx.currentTime)

        // Low-pass filter for warm analog feel
        const filter = ctx.createBiquadFilter()
        filter.type = "lowpass"
        filter.frequency.setValueAtTime(520, ctx.currentTime)
        filter.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.22)

        noteGain.gain.setValueAtTime(0.3, ctx.currentTime)
        noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.24)

        osc.connect(filter)
        filter.connect(noteGain)
        noteGain.connect(masterGain)

        osc.start()
        osc.stop(ctx.currentTime + 0.25)
        oscillators.push(osc)

        step++
      }

      tick()
      const intervalId = window.setInterval(tick, 250)
      timers.push(intervalId)

    } else if (theme === "cafe") {
      // ── Cafe: Warm lofi jazz chords (65 BPM) ──────────────────────────────
      const chords = [
        [261.63, 329.63, 392.0, 493.88], // Cmaj7
        [220.0, 261.63, 329.63, 392.0],  // Am7
        [174.61, 220.0, 261.63, 329.63], // Fmaj7
      ]
      let chordIndex = 0

      const playChord = () => {
        if (ctx.state === "closed") return
        const freqs = chords[chordIndex % chords.length]

        freqs.forEach((freq) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = "triangle"
          osc.frequency.setValueAtTime(freq, ctx.currentTime)

          const filter = ctx.createBiquadFilter()
          filter.type = "lowpass"
          filter.frequency.setValueAtTime(450, ctx.currentTime)

          gain.gain.setValueAtTime(0.08, ctx.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.8)

          osc.connect(filter)
          filter.connect(gain)
          gain.connect(masterGain)

          osc.start()
          osc.stop(ctx.currentTime + 0.85)
          oscillators.push(osc)
        })

        chordIndex++
      }

      playChord()
      const intervalId = window.setInterval(playChord, 750)
      timers.push(intervalId)

    } else {
      // ── Skincare: Ethereal harmonic crystal pad ────────────────────────────
      const padNotes = [392.0, 587.33, 783.99] // G4, D5, G5

      padNotes.forEach((freq) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = "sine"
        osc.frequency.setValueAtTime(freq, ctx.currentTime)

        // Slow vibrato
        const lfo = ctx.createOscillator()
        lfo.frequency.setValueAtTime(2.5, ctx.currentTime)
        const lfoGain = ctx.createGain()
        lfoGain.gain.setValueAtTime(4, ctx.currentTime)
        lfo.connect(lfoGain)
        lfoGain.connect(osc.frequency)
        lfo.start()

        gain.gain.setValueAtTime(0.12, ctx.currentTime)

        osc.connect(gain)
        gain.connect(masterGain)
        osc.start()
        oscillators.push(osc, lfo)
      })
    }

    const stop = () => {
      timers.forEach((t) => clearInterval(t))
      try {
        if (ctx.state !== "closed") {
          masterGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.12)
          setTimeout(() => {
            oscillators.forEach((o) => {
              try { o.stop() } catch { /* ignore */ }
            })
            ctx.close().catch(() => {})
          }, 140)
        }
      } catch {
        // ignore cleanup error
      }
    }

    return { context: ctx, stop }
  } catch (err) {
    console.warn("AudioContext error:", err)
    return null
  }
}
