import zipfile
import os

iwd_path = r"F:\Call Of Duty Modern Warfare 2\main\localized_english_aw08.iwd"
target_iwi = "images/weapon_ump45_iron.iwi"
out_path = r"f:\Shehab Projects\mw2-class-editor\debug_ump45.iwi"

if not os.path.exists(iwd_path):
    print(f"Error: {iwd_path} not found")
else:
    with zipfile.ZipFile(iwd_path, 'r') as z:
        if target_iwi in z.namelist():
            with z.open(target_iwi) as f_in:
                with open(out_path, 'wb') as f_out:
                    f_out.write(f_in.read())
            print(f"Extracted to {out_path}")
        else:
            print(f"Error: {target_iwi} not found in {iwd_path}")
