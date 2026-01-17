#!/bin/bash

# =============================================
# Image Optimization Script for Portfolio
# Compresses images to improve page load speed
# =============================================

echo "🖼️  Image Optimization Script for Portfolio"
echo "============================================"
echo ""

# Check if required tools are installed
check_dependencies() {
    local missing=""
    
    if ! command -v convert &> /dev/null; then
        missing="$missing imagemagick"
    fi
    
    if ! command -v jpegoptim &> /dev/null; then
        missing="$missing jpegoptim"
    fi
    
    if ! command -v pngquant &> /dev/null; then
        missing="$missing pngquant"
    fi
    
    if [ -n "$missing" ]; then
        echo "❌ Missing dependencies:$missing"
        echo ""
        echo "Install them with:"
        echo "  sudo pacman -S imagemagick jpegoptim pngquant"
        echo "  # or for Ubuntu/Debian:"
        echo "  sudo apt install imagemagick jpegoptim pngquant"
        exit 1
    fi
    
    echo "✅ All dependencies found!"
    echo ""
}

# Create backup directory
create_backup() {
    local backup_dir="$1_backup_$(date +%Y%m%d_%H%M%S)"
    echo "📦 Creating backup at: $backup_dir"
    cp -r "$1" "$backup_dir"
    echo "✅ Backup created!"
    echo ""
}

# Optimize gallery images
optimize_gallery() {
    local gallery_dir="./galeri"
    
    if [ ! -d "$gallery_dir" ]; then
        echo "❌ Gallery directory not found: $gallery_dir"
        return 1
    fi
    
    echo "🔄 Optimizing gallery images..."
    echo ""
    
    local total_before=0
    local total_after=0
    
    for img in "$gallery_dir"/*.jpg "$gallery_dir"/*.jpeg; do
        [ -f "$img" ] || continue
        
        local before=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
        total_before=$((total_before + before))
        
        local filename=$(basename "$img")
        echo "  Processing: $filename ($(numfmt --to=iec $before 2>/dev/null || echo "${before}B"))"
        
        # Resize large images to max 1200px width while maintaining aspect ratio
        # and compress with quality 85
        convert "$img" \
            -resize "1200x1200>" \
            -quality 85 \
            -strip \
            -interlace Plane \
            "$img"
        
        # Further optimize with jpegoptim
        jpegoptim --strip-all --max=85 -q "$img"
        
        local after=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
        total_after=$((total_after + after))
        
        echo "    → Compressed to: $(numfmt --to=iec $after 2>/dev/null || echo "${after}B")"
    done
    
    echo ""
    echo "📊 Gallery Summary:"
    echo "   Before: $(numfmt --to=iec $total_before 2>/dev/null || echo "${total_before}B")"
    echo "   After:  $(numfmt --to=iec $total_after 2>/dev/null || echo "${total_after}B")"
    local saved=$((total_before - total_after))
    echo "   Saved:  $(numfmt --to=iec $saved 2>/dev/null || echo "${saved}B")"
    echo ""
}

# Optimize asset images
optimize_assets() {
    local assets_dir="./assets"
    
    if [ ! -d "$assets_dir" ]; then
        echo "❌ Assets directory not found: $assets_dir"
        return 1
    fi
    
    echo "🔄 Optimizing asset images..."
    echo ""
    
    local total_before=0
    local total_after=0
    
    # Optimize JPG files
    for img in "$assets_dir"/*.jpg "$assets_dir"/*.jpeg; do
        [ -f "$img" ] || continue
        
        local before=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
        total_before=$((total_before + before))
        
        local filename=$(basename "$img")
        echo "  Processing: $filename"
        
        convert "$img" \
            -resize "800x800>" \
            -quality 85 \
            -strip \
            -interlace Plane \
            "$img"
        
        jpegoptim --strip-all --max=85 -q "$img"
        
        local after=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
        total_after=$((total_after + after))
    done
    
    # Optimize PNG files
    for img in "$assets_dir"/*.png; do
        [ -f "$img" ] || continue
        
        local before=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
        total_before=$((total_before + before))
        
        local filename=$(basename "$img")
        echo "  Processing: $filename"
        
        # Resize if too large
        convert "$img" \
            -resize "800x800>" \
            -strip \
            "$img"
        
        # Optimize with pngquant
        pngquant --force --quality=65-85 --ext .png "$img" 2>/dev/null || true
        
        local after=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
        total_after=$((total_after + after))
    done
    
    echo ""
    echo "📊 Assets Summary:"
    echo "   Before: $(numfmt --to=iec $total_before 2>/dev/null || echo "${total_before}B")"
    echo "   After:  $(numfmt --to=iec $total_after 2>/dev/null || echo "${total_after}B")"
    local saved=$((total_before - total_after))
    echo "   Saved:  $(numfmt --to=iec $saved 2>/dev/null || echo "${saved}B")"
    echo ""
}

# Main execution
main() {
    cd "$(dirname "$0")"
    
    check_dependencies
    
    echo "⚠️  This script will compress all images in galeri/ and assets/"
    echo "   Original images will be REPLACED with optimized versions."
    echo ""
    read -p "Create backup before proceeding? (y/n): " create_bak
    
    if [ "$create_bak" = "y" ] || [ "$create_bak" = "Y" ]; then
        [ -d "./galeri" ] && create_backup "./galeri"
        [ -d "./assets" ] && create_backup "./assets"
    fi
    
    optimize_gallery
    optimize_assets
    
    echo "✅ Image optimization complete!"
    echo ""
    echo "🚀 Your portfolio should now load much faster!"
}

main "$@"
