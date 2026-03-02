import zipfile
import struct
import os

iwd_path = r"F:\Call Of Duty Modern Warfare 2\main\localized_english_aw08.iwd"
target_iwi = "images/weapon_ump45_iron.iwi"

def hex_dump(data, length=128):
    print("--- HEX DUMP (First 128 bytes) ---")
    for i in range(0, min(len(data), length), 16):
        chunk = data[i:i+16]
        hex_str = " ".join(f"{b:02x}" for b in chunk)
        ascii_str = "".join(chr(b) if 32 <= b <= 126 else "." for b in chunk)
        print(f"{i:04x}: {hex_str:<48} | {ascii_str}")

if not os.path.exists(iwd_path):
    print(f"Error: {iwd_path} not found")
else:
    with zipfile.ZipFile(iwd_path, 'r') as z:
        if target_iwi in z.namelist():
            with z.open(target_iwi) as f:
                raw_data = f.read()
                print(f"File: {target_iwi}")
                print(f"Total Size: {len(raw_data)} bytes")
                hex_dump(raw_data)
                
                # Try parsing what we think we know
                if raw_data[:3] == b"IWi":
                    ver = raw_data[3]
                    fmt = raw_data[4]
                    usage = raw_data[5]
                    width = struct.unpack_from("<H", raw_data, 10)[0]
                    height = struct.unpack_from("<H", raw_data, 12)[0]
                    print(f"\nParsed: Ver={ver}, Format={fmt}, Usage={usage}, Width={width}, Height={height}")
        else:
            print(f"Error: {target_iwi} not found in {iwd_path}")
