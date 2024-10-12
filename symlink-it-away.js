#!/usr/bin/env node

import * as os from 'node:os'
import * as fs from 'node:fs'
import * as n_path from 'node:path'
const log = console.log

const awayDir = n_path.join(os.homedir(), '.slia')

function scanForNodeModules(initialPath = process.cwd()) {
  log(`Symlinking away any node_modules found under: ${initialPath}`)
  const directoriesToScan = [initialPath]
  for (const directoryPath of directoriesToScan) {
    const entries = fs.readdirSync(directoryPath, {withFileTypes: true})
    for (const entry of entries) {
      if (entry.isSymbolicLink()) {
        continue
      }
      if (entry.isDirectory()) {
        const entryPath = entry.parentPath + n_path.sep + entry.name// + n_path.sep
        if (entry.name == 'node_modules') {
          symlinkItAway(entryPath)
          continue // do not scan inside of it
        }
        directoriesToScan.push(entryPath)
      }
    }
  }
}

function symlinkItAway(path) {
  try {
    const relativePath = n_path.relative(os.homedir(), path)
    if (relativePath.startsWith('..')) {
      throw Error(`We only support creating symlinks within the current user folder.`)
    }
    const relocatedPath = n_path.join(awayDir, relativePath)
    const stat = fs.lstatSync(path)
    if (stat.isSymbolicLink()) {
      if (fs.existsSync(relocatedPath)) {
        log(`Reversing previous symlink: ${path}`)
        fs.rmSync(path) // delete symlink
        fs.renameSync(relocatedPath, path) // move back content
      } else {
        throw Error(`Target is already a symbolic link.`)
      }
    } else {
      log(`Symlinking away: ${path}`)
      fs.mkdirSync(n_path.dirname(relocatedPath), {recursive: true})
      try {
        fs.renameSync(path, relocatedPath)
      } catch (error) {
        // if moving a directory and the target dir is not empty
        if (error.code == 'ENOTEMPTY') {
          log(`Target directory not empty, deleting it... 😜`)
          fs.rmSync(relocatedPath, {recursive: true})
          fs.renameSync(path, relocatedPath) // trying again
        } else throw error
      }
      fs.symlinkSync(relocatedPath, path)
    }
  } catch (error) {
    log(`Could not symlink this path: ${error}`)
  }
}

const args = process.argv
switch (args.length) {
  case 2: scanForNodeModules(); break
  case 3: symlinkItAway(args[2]); break
  default: console.log('Invalid number of arguments.')
}
