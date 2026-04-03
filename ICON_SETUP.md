# Setting Up Your App Icon

Your Trading Journal desktop app needs an icon file in `.ico` format. We've generated a nice professional trading icon for you as `public/icon.png`.

## Quick Conversion (ICO Format)

The easiest way to convert your PNG to ICO:

### Option 1: Online Converter (Fastest)
1. Go to: https://convertio.co/png-ico/
2. Upload `public/icon.png`
3. Download the `.ico` file
4. Save it as `public/icon.ico` in your project folder
5. Done! Your desktop app will use this icon

### Option 2: Windows 10/11 Built-in
1. Right-click `public/icon.png`
2. Select "Rename"
3. Change extension from `.png` to `.ico`
   - Change: `icon.png` → `icon.ico`
4. Windows will convert it automatically

### Option 3: Use Image Editor
- Photoshop: File → Export As → .ico
- Paint.NET: Plugins → save as .ico
- GIMP: File → Export As → .ico

## What We've Included

- **icon.png** - Professional 512x512 trading app icon (ready to use)
- **Build scripts** - Automatically look for icon.ico to create your desktop app

## After Converting to ICO

1. Place the `.ico` file in the `public/` folder
2. Run: `npm run electron-build-win`
3. Your desktop app installer will include the icon
4. The icon will appear in:
   - Your Windows taskbar
   - Start Menu
   - Application shortcuts
   - File properties

## Customizing the Icon

Don't like the default icon? Here's how to create your own:

1. Design a 256x256 (or larger) square image
2. Save as PNG
3. Replace `public/icon.png`
4. Convert to ICO format using one of the methods above
5. Rebuild your app

## Icon Tips

- **Size**: At least 256x256 pixels (512x512 is ideal)
- **Format**: PNG or JPEG to start, convert to ICO for Windows
- **Style**: Keep it simple and recognizable at small sizes
- **Colors**: 3-5 main colors work best for icons

## Need Help?

If the icon isn't showing:
1. Make sure `public/icon.ico` exists
2. Run `npm run electron-build-win` again
3. Check that icon file is at least 256x256 pixels
4. Try regenerating from PNG with a converter tool

Your professional trading journal icon is ready - just convert it to ICO format!
