
# symlink-it-away

## What the fuck?!

It's a tool I made mainly to symlink away shit from Dropbox (since Dropbox doesn't upload the contents of symlinks).

By default it will recursively scan the current directory and symlink any `node_modules` out of there.

The symlinked content is placed under `/home-folder/.slia/original-path-relative-to-home-folder`.

To symlink away anything else just specify the path to the file or the directory to symlink away. Do it again to undo.

## How to fucking use?!

#### Install globally to run it like `symlink-it-away` from anywhere:
```bash
npm install --global symlink-it-away
```

#### Or just use `npx symlink-it-away` to run it.

## That's it bitches!

That's all there is to it. Now get lost!
