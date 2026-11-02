# Changelog

## 1.0.0

Split `roblox-vfx` and `roblox-sfx` out of the rxz Roblox Skills pack into their
own two-folder download, for people who want effects and sound and nothing else.

- **No installer.** `install.ps1` and `install.sh` are gone. Two folders go into
  `.claude/skills`; that is the whole install.
- **No setup skill, no `LOCAL.md`.** The VFX library defaults to
  `~/Roblox-VFX-Library` and is created the first time a script needs it.
  `--lib` and `ROBLOX_VFX_LIB` still override it. The setup-skill paragraph at
  the top of both `SKILL.md` files is replaced with what each skill actually
  needs, which for SFX is nothing.
- **Nothing else changed.** Scripts, references, examples and the measured
  behaviour are the ones from the main pack.

The main pack keeps both skills; this is a cut-down copy, not a fork.
