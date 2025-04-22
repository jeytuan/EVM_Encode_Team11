from PIL import Image
import json
import os
from datetime import datetime
from pathlib import Path

# Base project directory setup
BASE_DIR = Path(__file__).resolve().parents[2]
ASSETS_DIR = BASE_DIR / "drypto" / "nft-generator" / "assets"
CONFIG_DIR = BASE_DIR / "drypto" / "nft-generator" / "config"
OUTPUT_DIR = BASE_DIR / "drypto" / "nft-generator" / "output"

PRIMAL_MAPPING_PATH = CONFIG_DIR / "primal_mapping.json"
LOOKUP_PATH = CONFIG_DIR / "animal_lookup.json"

def load_primal_mapping():
    with open(PRIMAL_MAPPING_PATH, 'r') as f:
        return json.load(f)

def load_animal_lookup():
    with open(LOOKUP_PATH, 'r') as f:
        return json.load(f)

def determine_primal_animal(birthdate_str):
    birthdate = datetime.strptime(birthdate_str, "%Y-%m-%d").date()
    for entry in load_primal_mapping():
        start = datetime.strptime(entry["start"], "%Y-%m-%d").date()
        end = datetime.strptime(entry["end"], "%Y-%m-%d").date()
        if start <= birthdate <= end:
            return entry["animal"], entry["element"]
    return "unknown", "unknown"

def load_layer(path: Path) -> Image.Image:
    if not path.exists():
        raise FileNotFoundError(f"Layer not found: {path}")
    return Image.open(path).convert("RGBA")

def optional_layer(path: Path) -> Image.Image | None:
    return Image.open(path).convert("RGBA") if path.exists() else None

def compose_nft(layers):
    result = Image.new("RGBA", layers[0].size)
    for layer in layers:
        if layer:
            result = Image.alpha_composite(result, layer)
    return result

def generate_nft(birthdate: str, output_name: str, sun: str = None, moon: str = None, rising: str = None):
    animal_key, element = determine_primal_animal(birthdate)
    animal_lookup = load_animal_lookup()
    display_name = animal_lookup.get(animal_key, "Unknown")

    print(f"Generating NFT for {birthdate} → {display_name.title()} ({element.title()})")

    # Required layer paths
    background_path = ASSETS_DIR / "traits" / "backgrounds" / "default.png"
    base_path = ASSETS_DIR / "base_models" / "chibi_64bit_base.png"
    animal_path = ASSETS_DIR / "traits" / "animal_variants" / f"{animal_key}.png"
    element_path = ASSETS_DIR / "traits" / "elemental_effects" / f"{element}.png"

    # Optional zodiac modifier paths
    sun_path = ASSETS_DIR / "traits" / "zodiac_modifiers" / "sun" / f"{sun}.png" if sun else None
    moon_path = ASSETS_DIR / "traits" / "zodiac_modifiers" / "moon" / f"{moon}.png" if moon else None
    rising_path = ASSETS_DIR / "traits" / "zodiac_modifiers" / "rising" / f"{rising}.png" if rising else None

    # Build layers (including optional if present)
    layers = [
        load_layer(background_path),
        load_layer(base_path),
        load_layer(animal_path),
        load_layer(element_path),
        optional_layer(sun_path),
        optional_layer(moon_path),
        optional_layer(rising_path),
    ]

    final_image = compose_nft(layers)

    # Save result
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    save_path = OUTPUT_DIR / f"{output_name}.png"
    final_image.save(save_path)
    print(f"✅ NFT saved to: {save_path}")

# Dev test
if __name__ == "__main__":
    generate_nft(
        "1999-08-18",
        "testor_element_animal",
        sun="leo",
        moon="cancer",
        rising="virgo"
    )
