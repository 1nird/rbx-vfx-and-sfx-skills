# rxz · VFX + SFX

Two Claude Code skills for Roblox in one folder, split out of the rxz Roblox
Skills pack. Free, and there is no installer: you copy two folders and restart
Claude Code.

| Skill | What it does |
|---|---|
| `skills/roblox-vfx` | Harvest particle effects from packs *you own* into a JSON recipe library, then emit a `VFXKit` module that rebuilds them on any part, at any size and tint |
| `skills/roblox-sfx` | Search the Creator Store for the sound a game needs, prove every candidate loads in Studio, then emit a `SoundBank` module and an `Sfx` helper |

## Install

Copy both folders inside `skills/` into the folder Claude Code reads:

| OS | Where |
|---|---|
| Windows | `C:\Users\<you>\.claude\skills` |
| macOS / Linux | `~/.claude/skills` |

Create `skills` if it is not there. Restart Claude Code. That is the whole
install — no PowerShell, nothing to unblock, no admin, no key. This is why the
pack ships no `install.ps1`: two folders do not need one.

To use them in a single game instead of everywhere, put them in
`<your game>/.claude/skills/`; Claude Code reads project skills too.

## Use

Ask for the outcome. The skill descriptions are written so Claude picks them up
from a plain request:

- "sound my game: footsteps, a gunshot, a UI click, forest ambience"
- "harvest the VFX in this place, then build me a hit effect and an aura"
- "why is my ParticleEmitter invisible?"

## What you need

- Claude Code, and Roblox Studio with its MCP enabled and open, for anything
  that touches a place.
- Python 3.11+ for the scripts.

That is all. No API key, no upload, no Open Cloud audio quota. SFX leans on one
measured fact: a free Creator Store audio asset plays in an unsaved place with no
ownership, so sound needs a search and a check, not an upload.

## Where your VFX library lives

`roblox-vfx` ships **no effects**. It is a harvester: you take free VFX packs into
your own Roblox account (Get / Add to Inventory — Studio refuses to load an asset
you do not own), put them in a place, and the skill reads every emitter property
out of Studio into recipes.

The library is `~/Roblox-VFX-Library` by default and is created on first use,
with `recipes/` and `harvested/`. Keep it out of cloud-synced folders. To move it:

```bash
--lib "D:/Roblox/vfx"            # any script
setx ROBLOX_VFX_LIB "D:\Roblox\vfx"    # or for every run (Windows)
```

Nothing else reads configuration, and no file needs editing.

Check each pack's own terms before publishing a game with its effects. Keeping
your library private is the point: extracting a pack's values and shipping them
as your own pack is a different act from using them in a game.

## Files

```
START-HERE.txt   the two-folder install, in plain words
README.md        this file
LICENSE.txt      what you may and may not do
CHANGELOG.md     what changed
skills/
  roblox-vfx/    SKILL.md, scripts/, references/
  roblox-sfx/    SKILL.md, scripts/, examples/
```

## Licence

Free to use and change, including in commercial Roblox games. Not for resale.
Full text in `LICENSE.txt`.
