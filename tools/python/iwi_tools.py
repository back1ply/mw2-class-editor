"""Shared utilities for CoD MW2 (IW4) IWI image decoding."""
import struct
import io
from PIL import Image

def iwi_to_image(raw: bytes) -> Image.Image:
    """
    Parse IWI bytes (MW2 v8) and return a PIL Image.
    Navigates the mipmap chain to extract the largest image (stored at the end).
    """
    if len(raw) < 32:
        raise ValueError("File too small to be IWI")
    if raw[:3] != b"IWi":
        raise ValueError("Not an IWI file")
    
    version = raw[3]
    fmt_byte = raw[4]
    
    # IWI v8: Width at 10, Height at 12
    width  = struct.unpack_from("<H", raw, 10)[0]
    height = struct.unpack_from("<H", raw, 12)[0]
    
    # Determine format properties
    is_compressed = False
    block_size = 0
    fourcc = b""
    
    if fmt_byte in (0x05, 0x0B): # DXT1
        is_compressed, block_size, fourcc = True, 8, b"DXT1"
    elif fmt_byte == 0x0C: # DXT3
        is_compressed, block_size, fourcc = True, 16, b"DXT3"
    elif fmt_byte == 0x0D: # DXT5 (Note: 0x73 removed, it's uncompressed)
        is_compressed, block_size, fourcc = True, 16, b"DXT5"
    
    if is_compressed:
        # Calculate size of the main image (Mip 0)
        # DXT measures in 4x4 blocks
        blocks_w = (width + 3) // 4
        blocks_h = (height + 3) // 4
        main_size = blocks_w * blocks_h * block_size
        
        # MW2 stores mipmaps smallest-to-largest. 
        # The largest image is the LAST main_size bytes.
        if len(raw) < main_size + 32:
            raise ValueError(f"IWI truncated: expected at least {main_size+32} bytes, got {len(raw)}")
            
        data_offset = len(raw) - main_size
        image_data = raw[data_offset:]
        
        # ─── Construct DDS Header (128 bytes) ───
        dds = bytearray(128)
        struct.pack_into("<4s", dds, 0, b"DDS ")
        struct.pack_into("<I", dds, 4, 124) # dwSize
        # dwFlags: CAPS (0x1) | HEIGHT (0x2) | WIDTH (0x4) | PIXELFORMAT (0x1000) | LINEARSIZE (0x80000)
        struct.pack_into("<I", dds, 8, 0x81007)
        struct.pack_into("<I", dds, 12, height)
        struct.pack_into("<I", dds, 16, width)
        struct.pack_into("<I", dds, 20, main_size) # dwPitchOrLinearSize
        struct.pack_into("<I", dds, 28, 1) # dwMipMapCount = 1 (we only provide Mip 0)
        
        # Pixel Format
        pf_offset = 76
        struct.pack_into("<I", dds, pf_offset, 32)      # dwSize
        struct.pack_into("<I", dds, pf_offset + 4, 0x4) # DDPF_FOURCC
        struct.pack_into("<4s", dds, pf_offset + 8, fourcc)
        
        # Caps
        struct.pack_into("<I", dds, 108, 0x1000) # DDSCAPS_TEXTURE
        
        try:
            # Use Pillow to decode the DXT data
            img = Image.open(io.BytesIO(dds + image_data))
            # Load the data so we can close the stream
            img.load()
            return img
        except Exception as e:
            raise ValueError(f"Failed to decode {fourcc.decode()}: {e}")

    # ─── Uncompressed Formats ───
    # Header is 32 bytes
    data = raw[32:]
    
    if fmt_byte in (0x01, 0x73): # RGBA8 or A8/L8 variant
        # Detect bit depth based on available data size
        size_rgba = width * height * 4
        size_a8   = width * height
        
        if len(data) >= size_rgba:
            return Image.frombytes("RGBA", (width, height), data[-size_rgba:])
        elif len(data) >= size_a8:
            # Treat as Alpha-only (common for some 0x73 icons)
            alpha = Image.frombytes("L", (width, height), data[-size_a8:])
            img = Image.new("RGBA", (width, height), (255, 255, 255, 255))
            img.putalpha(alpha)
            return img
        else:
            raise ValueError(f"Truncated 0x73: expected at least {size_a8}, got {len(data)}")
    
    if fmt_byte == 0x02: # RGB8
        size = width * height * 3
        if len(data) < size: raise ValueError("Truncated RGB8")
        return Image.frombytes("RGB", (width, height), data[-size:])

    if fmt_byte == 0x08: # A8 (stored as grayscale, used as alpha)
        size = width * height
        if len(data) < size: raise ValueError("Truncated A8")
        alpha = Image.frombytes("L", (width, height), data[-size:])
        img = Image.new("RGBA", (width, height), (255, 255, 255, 255))
        img.putalpha(alpha)
        return img

    raise ValueError(f"Unsupported IWI v{version} format code: {hex(fmt_byte)}")
