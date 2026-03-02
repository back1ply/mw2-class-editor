"""
Extract ALL hud_ images from every IWD found under the game directory.

Usage:
  python extract_hud_all.py
  python extract_hud_all.py --prefix hud_        # default, any hud_* image
  python extract_hud_all.py --prefix specialty_  # extract specialty_ instead
  python extract_hud_all.py --dry-run            # scan only, no output files
"""
import argparse, zipfile
from pathlib import Path
from iwi_tools import iwi_to_image

# ── config ──────────────────────────────────────────────────────────────────
GAME_DIR = Path("F:/Call Of Duty Modern Warfare 2")
OUT_DIR  = Path("F:/Shehab Projects/mw2-class-editor/img/all")

# Sub-directories inside the game root that may contain IWDs
IWD_SEARCH_DIRS = ["main", "iw4x"]

# When the same image name appears in multiple IWDs, the IWD that appears
# LATER in the discovered list wins (last-write-wins = most-specific mod wins).
PREFER_LAST = True
# ────────────────────────────────────────────────────────────────────────────


def discover_iwds(game_dir: Path) -> list[Path]:
    """Return all .iwd files found under game_dir, sorted for determinism."""
    found = []
    for sub in IWD_SEARCH_DIRS:
        d = game_dir / sub
        if d.is_dir():
            found.extend(sorted(d.glob("*.iwd")))
    return found


# ── main ─────────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--prefix",  default="hud_",
                    help="image name prefix to extract (default: hud_)")
    ap.add_argument("--dry-run", action="store_true",
                    help="scan and report without writing files")
    ap.add_argument("--game-dir", default=str(GAME_DIR),
                    help="path to the game root directory")
    ap.add_argument("--out-dir",  default=str(OUT_DIR),
                    help="output directory for PNGs")
    args = ap.parse_args()

    game_dir = Path(args.game_dir)
    out_dir  = Path(args.out_dir)
    prefix   = args.prefix
    dry_run  = args.dry_run

    if not dry_run:
        out_dir.mkdir(parents=True, exist_ok=True)

    # ── discover IWDs ────────────────────────────────────────────────────────
    iwds = discover_iwds(game_dir)
    if not iwds:
        print(f"[ERROR] No .iwd files found under {game_dir}")
        return
    print(f"Found {len(iwds)} IWD(s):\n" +
          "\n".join(f"  {p.relative_to(game_dir)}" for p in iwds) + "\n")

    # ── catalogue: name -> (iwd, entry) ──────────────────────────────────────
    catalogue: dict[str, tuple[Path, str]] = {}
    for iwd in iwds:
        try:
            with zipfile.ZipFile(iwd) as z:
                for entry in z.namelist():
                    base = entry.rsplit("/", 1)[-1]
                    if base.startswith(prefix) and base.endswith(".iwi"):
                        name = base[:-4]
                        if PREFER_LAST or name not in catalogue:
                            catalogue[name] = (iwd, entry)
        except Exception as e:
            print(f"[WARN] Cannot open {iwd.name}: {e}")

    print(f"Catalogued {len(catalogue)} unique '{prefix}*' images\n")

    if dry_run:
        for name, (iwd, entry) in sorted(catalogue.items()):
            print(f"  {name}  <- {iwd.name}/{entry}")
        return

    # ── extract ───────────────────────────────────────────────────────────────
    ok = fail = 0
    for name, (iwd, entry) in sorted(catalogue.items()):
        try:
            with zipfile.ZipFile(iwd) as z:
                raw = z.read(entry)
            img = iwi_to_image(raw)
            img.save(out_dir / f"{name}.png", "PNG")
            print(f"  [OK]  {name}.png  ({img.width}x{img.height})  <- {iwd.name}")
            ok += 1
        except Exception as e:
            print(f"  [ERR] {name}: {e}")
            fail += 1

    print(f"\nDone: {ok} ok, {fail} failed  ->  {out_dir}")


if __name__ == "__main__":
    main()
