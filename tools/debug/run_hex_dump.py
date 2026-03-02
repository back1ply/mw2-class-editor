import zipfile
import struct
import os

iwd_path = r"F:\Call Of Duty Modern Warfare 2\main\localized_english_aw08.iwd"
target_iwi = "images/weapon_ump45_iron.iwi"

def get_hex_dump(data, length=256):
    lines = []
    lines.append(f"File: {target_iwi}")
    lines.append(f"Total Size: {len(data)} bytes")
    lines.append("--- HEX DUMP ---")
    for i in range(0, min(len(data), length), 16):
        chunk = data[i:i+16]
        hex_str = " ".join(f"{b:02x}" for b in chunk)
        ascii_str = "".join(chr(b) if 32 <= b <= 126 else "." for b in chunk)
        lines.append(f"{i:04x}: {hex_str:<48} | {ascii_str}")
    return "\n".join(lines)

if not os.path.exists(iwd_path):
    result = f"Error: {iwd_path} not found"
else:
    with zipfile.ZipFile(iwd_path, 'r') as z:
        if target_iwi in z.namelist():
            with z.open(target_iwi) as f:
                raw_data = f.read()
                dump = get_hex_dump(raw_data)
                
                if raw_data[:3] == b"IWi":
                    ver = raw_data[3]
                    fmt = raw_data[4]
                    usage = raw_data[5]
                    width = struct.unpack_from("<H", raw_data, 10)[0]
                    height = struct.unpack_from("<H", raw_data, 12)[0]
                    mip_count = raw_data[8]
                    dump += f"\n\nParsed: Ver={ver}, Format={hex(fmt)}, Usage={usage}, Width={width}, Height={height}, MipCount={mip_count}"
                result = dump
        else:
            result = f"Error: {target_iwi} not found in {iwd_path}"

with open(r"f:\Shehab Projects\mw2-class-editor\hex_dump.txt", "w") as f:
    f.write(result)
