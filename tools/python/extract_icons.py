"""
MW2 Icon Extractor
Extracts and converts IWI images from game IWD archives to PNG.
Covers: weapons, perks, killstreaks, deathstreaks, tactical, equipment.

Usage: python extract_icons.py
Output: F:/Shehab Projects/mw2-class-editor/img/curated/
"""

import zipfile
from pathlib import Path
from iwi_tools import iwi_to_image

# ─── Paths ────────────────────────────────────────────────────────────────────

GAME_DIR  = Path("F:/Call Of Duty Modern Warfare 2")
IWD_MAIN  = GAME_DIR / "main"
OUT_DIR   = Path("F:/Shehab Projects/mw2-class-editor/img/curated")

AW01 = str(IWD_MAIN / "localized_english_aw01.iwd")
AW06 = str(IWD_MAIN / "localized_english_aw06.iwd")
AW07 = str(IWD_MAIN / "localized_english_aw07.iwd")
AW08 = str(IWD_MAIN / "localized_english_aw08.iwd")

# ─── Icon mapping ─────────────────────────────────────────────────────────────
# Format: (iwd_path, "images/source.iwi", "category/output_name.png")

ICONS = [
    # ── WEAPONS (create-a-class 300×152 menu images from aw07/aw08) ──────────
    # Assault Rifles
    (AW08, "images/weapon_m4carbine.iwi",    "weapons/m4.png"),
    (AW08, "images/weapon_famas.iwi",         "weapons/famas.png"),
    (AW08, "images/weapon_scar_h.iwi",        "weapons/scar.png"),
    (AW08, "images/weapon_tavor.iwi",         "weapons/tar21.png"),
    (AW08, "images/weapon_fnfal.iwi",         "weapons/fal.png"),
    (AW08, "images/weapon_m16a4.iwi",         "weapons/m16.png"),
    (AW08, "images/weapon_masada_iron.iwi",   "weapons/masada.png"),    # ACR
    (AW08, "images/weapon_fn2000_iron.iwi",   "weapons/f2000.png"),
    (AW07, "images/weapon_ak47.iwi",          "weapons/ak47.png"),
    (AW08, "images/weapon_sa80.iwi",          "weapons/sa80.png"),      # L86 LSW
    # LMGs
    (AW08, "images/weapon_rpd.iwi",           "weapons/rpd.png"),
    (AW08, "images/weapon_mg4.iwi",           "weapons/mg4.png"),
    (AW08, "images/weapon_steyr.iwi",         "weapons/aug.png"),       # AUG HBAR (Steyr AUG)
    (AW08, "images/weapon_m240.iwi",          "weapons/m240.png"),
    # SMGs
    (AW08, "images/weapon_ump45_iron.iwi",    "weapons/ump45.png"),
    (AW08, "images/weapon_kriss.iwi",         "weapons/vector.png"),    # Kriss Super V
    (AW08, "images/weapon_p90.iwi",           "weapons/p90.png"),
    (AW08, "images/weapon_mp5k.iwi",          "weapons/mp5k.png"),
    (AW08, "images/weapon_uzi.iwi",           "weapons/uzi.png"),
    # Snipers
    (AW07, "images/weapon_barrett50cal.iwi",  "weapons/barrett.png"),
    (AW08, "images/weapon_wa2000.iwi",        "weapons/wa2000.png"),
    (AW08, "images/weapon_cheytac_scope.iwi", "weapons/cheytac.png"),   # Intervention
    (AW08, "images/weapon_m14ebr.iwi",        "weapons/m14ebr.png"),
    (AW08, "images/weapon_dragunovsvd.iwi",   "weapons/dragunov.png"),
    # Shotguns
    (AW07, "images/weapon_aa12.iwi",          "weapons/aa12.png"),
    (AW08, "images/weapon_striker.iwi",       "weapons/striker.png"),
    (AW08, "images/weapon_sawed_off.iwi",     "weapons/ranger.png"),    # Ranger (sawed-off 1887)
    (AW08, "images/weapon_m1014.iwi",         "weapons/m1014.png"),
    (AW08, "images/weapon_spas12.iwi",        "weapons/spas12.png"),
    # Handguns
    (AW08, "images/weapon_usp_45.iwi",        "weapons/usp.png"),
    (AW08, "images/weapon_m9beretta.iwi",     "weapons/m9.png"),
    (AW08, "images/weapon_desert_eagle.iwi",  "weapons/deserteagle.png"),
    (AW08, "images/weapon_colt_anaconda.iwi", "weapons/coltanaconda.png"),
    # Machine Pistols
    (AW08, "images/weapon_pp2000.iwi",        "weapons/pp2000.png"),
    (AW08, "images/weapon_glock.iwi",         "weapons/glock.png"),     # G18
    (AW07, "images/weapon_beretta393.iwi",    "weapons/beretta393.png"),# M93 Raffica
    (AW08, "images/weapon_mp9_v2.iwi",        "weapons/tmp.png"),       # TMP (real: MP9)
    # Launchers
    (AW07, "images/weapon_at4.iwi",           "weapons/at4.png"),
    (AW08, "images/weapon_m79.iwi",           "weapons/thumper.png"),
    (AW08, "images/weapon_stinger.iwi",       "weapons/stinger.png"),
    (AW08, "images/weapon_javelin.iwi",       "weapons/javelin.png"),
    (AW08, "images/weapon_rpg7.iwi",          "weapons/rpg.png"),
    # Special
    (AW08, "images/weapon_riotshield.iwi",    "weapons/riotshield.png"),

    # ── PERKS (specialty_ icons — these are already the create-a-class icons) ─
    # Tier 1
    (AW06, "images/specialty_marathon.iwi",              "perks/marathon.png"),
    (AW06, "images/specialty_marathon_upgrade.iwi",      "perks/marathon_pro.png"),
    (AW06, "images/specialty_fastreload.iwi",            "perks/sleight_of_hand.png"),
    (AW06, "images/specialty_fastreload_upgrade.iwi",    "perks/sleight_of_hand_pro.png"),
    (AW06, "images/specialty_scavenger.iwi",             "perks/scavenger.png"),
    (AW06, "images/specialty_scavenger_upgrade.iwi",     "perks/scavenger_pro.png"),
    (AW06, "images/specialty_bling.iwi",                 "perks/bling.png"),
    (AW06, "images/specialty_bling_upgrade.iwi",         "perks/bling_pro.png"),
    (AW06, "images/specialty_one_man_army.iwi",          "perks/one_man_army.png"),
    (AW06, "images/specialty_one_man_army_upgrade.iwi",  "perks/one_man_army_pro.png"),
    # Tier 2
    (AW06, "images/specialty_bulletdamage.iwi",              "perks/stopping_power.png"),
    (AW06, "images/specialty_bulletdamage_upgrade.iwi",      "perks/stopping_power_pro.png"),
    (AW06, "images/specialty_lightweight.iwi",               "perks/lightweight.png"),
    (AW06, "images/specialty_lightweight_upgrade.iwi",       "perks/lightweight_pro.png"),
    (AW06, "images/specialty_hardline.iwi",                  "perks/hardline.png"),
    (AW06, "images/specialty_hardline_upgrade.iwi",          "perks/hardline_pro.png"),
    (AW06, "images/specialty_cold_blooded.iwi",              "perks/cold_blooded.png"),
    (AW06, "images/specialty_cold_blooded_upgrade.iwi",      "perks/cold_blooded_pro.png"),
    (AW06, "images/specialty_danger_close.iwi",              "perks/danger_close.png"),
    (AW06, "images/specialty_danger_close_upgrade.iwi",      "perks/danger_close_pro.png"),
    # Tier 3
    (AW06, "images/specialty_commando.iwi",                  "perks/commando.png"),
    (AW06, "images/specialty_commando_upgrade.iwi",          "perks/commando_pro.png"),
    (AW06, "images/specialty_bulletaccuracy.iwi",            "perks/steady_aim.png"),
    (AW06, "images/specialty_bulletaccuracy_upgrade.iwi",    "perks/steady_aim_pro.png"),
    (AW06, "images/specialty_scrambler.iwi",                 "perks/scrambler.png"),
    (AW06, "images/specialty_scrambler_upgrade.iwi",         "perks/scrambler_pro.png"),
    (AW06, "images/specialty_ninja.iwi",                     "perks/ninja.png"),
    (AW06, "images/specialty_ninja_pro.iwi",                 "perks/ninja_pro.png"),
    (AW06, "images/specialty_sitrep.iwi",                    "perks/sitrep.png"),
    (AW06, "images/specialty_sitrep_pro.iwi",                "perks/sitrep_pro.png"),
    (AW06, "images/specialty_pistoldeath.iwi",               "perks/last_stand.png"),
    (AW06, "images/specialty_pistoldeath_upgrade.iwi",       "perks/last_stand_pro.png"),

    # ── KILLSTREAKS ───────────────────────────────────────────────────────────
    (AW06, "images/specialty_uav.iwi",                  "killstreaks/uav.png"),
    (AW06, "images/specialty_care_package.iwi",         "killstreaks/care_package.png"),
    (AW06, "images/specialty_counter_uav.iwi",          "killstreaks/counter_uav.png"),
    (AW06, "images/specialty_airdrop_sentry.iwi",       "killstreaks/sentry_gun.png"),
    (AW06, "images/specialty_predator_missile.iwi",     "killstreaks/predator_missile.png"),
    (AW06, "images/specialty_precision_airstrike.iwi",  "killstreaks/precision_airstrike.png"),
    (AW06, "images/specialty_harrier_strike.iwi",       "killstreaks/harrier_strike.png"),
    (AW06, "images/specialty_heli_support.iwi",         "killstreaks/attack_helicopter.png"),
    (AW06, "images/specialty_emergency_airdrop.iwi",    "killstreaks/emergency_airdrop.png"),
    (AW06, "images/specialty_heli_flares.iwi",          "killstreaks/pave_low.png"),
    (AW06, "images/specialty_stealth_bomber.iwi",       "killstreaks/stealth_bomber.png"),
    (AW06, "images/specialty_cobra_gunner.iwi",         "killstreaks/chopper_gunner.png"),
    (AW06, "images/specialty_ac130.iwi",                "killstreaks/ac130.png"),
    (AW06, "images/specialty_emp.iwi",                  "killstreaks/emp.png"),
    (AW06, "images/specialty_nuke.iwi",                 "killstreaks/nuke.png"),
    (AW06, "images/specialty_null.iwi",                 "killstreaks/none.png"),

    # ── DEATHSTREAKS ─────────────────────────────────────────────────────────
    (AW01, "images/cardicon_copycat.iwi",                     "deathstreaks/copycat.png"),
    (AW01, "images/cardicon_painkiller.iwi",                  "deathstreaks/painkiller.png"),
    (AW01, "images/cardicon_final_stand.iwi",                 "deathstreaks/final_stand.png"),
    (AW06, "images/specialty_grenadepulldeath_locked.iwi",    "deathstreaks/martyrdom.png"),
    (AW06, "images/specialty_quieter_locked.iwi",             "deathstreaks/juiced.png"),

    # ── TACTICAL ─────────────────────────────────────────────────────────────
    (AW08, "images/weapon_flashbang.iwi",     "tactical/flash_grenade.png"),
    (AW08, "images/weapon_smokegrenade.iwi",  "tactical/smoke_grenade.png"),
    (AW08, "images/weapon_concgrenade.iwi",   "tactical/stun_grenade.png"),
    (AW07, "images/weapon_attachment_heartbeat.iwi", "tactical/heartbeat_sensor.png"),

    # ── EQUIPMENT ────────────────────────────────────────────────────────────
    (AW08, "images/weapon_fraggrenade.iwi",         "equipment/frag_grenade.png"),
    (AW01, "images/cardicon_semtex.iwi",            "equipment/semtex.png"),
    (AW01, "images/cardicon_throwing_knive.iwi",    "equipment/throwing_knife.png"),
    (AW08, "images/weapon_claymore.iwi",            "equipment/claymore.png"),
    (AW07, "images/weapon_c4.iwi",                  "equipment/c4.png"),
    (AW01, "images/cardicon_blast_shield.iwi",      "equipment/blast_shield.png"),
    (AW06, "images/specialty_tactical_insert.iwi",  "equipment/tactical_insertion.png"),
]

# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    # Create output directories
    for category in ("weapons", "perks", "killstreaks", "deathstreaks", "tactical", "equipment"):
        (OUT_DIR / category).mkdir(parents=True, exist_ok=True)

    # Open each IWD once, extract all needed entries
    iwd_groups: dict[str, list[tuple[str, str]]] = {}
    for iwd, iwi_path, out_rel in ICONS:
        iwd_groups.setdefault(iwd, []).append((iwi_path, out_rel))

    ok = failed = 0

    for iwd_path, entries in iwd_groups.items():
        iwd_name = Path(iwd_path).name
        try:
            with zipfile.ZipFile(iwd_path) as zf:
                available = set(zf.namelist())
                for iwi_path, out_rel in entries:
                    out_path = OUT_DIR / out_rel
                    if iwi_path not in available:
                        print(f"  [MISSING in IWD] {iwi_path} ({iwd_name})")
                        failed += 1
                        continue
                    try:
                        raw = zf.read(iwi_path)
                        img = iwi_to_image(raw)
                        img.save(out_path, "PNG")
                        print(f"  [OK] {out_rel}  ({img.width}×{img.height})")
                        ok += 1
                    except Exception as e:
                        print(f"  [ERR] {out_rel}: {e}")
                        failed += 1
        except FileNotFoundError:
            print(f"[IWD NOT FOUND] {iwd_path}")
            for _, out_rel in entries:
                failed += 1

    print()
    print(f"Done: {ok} extracted, {failed} failed")
    print(f"Output: {OUT_DIR}")


if __name__ == "__main__":
    main()
