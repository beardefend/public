---
title: Linux file permissions explained — what I wish I knew earlier
date: '2026-05-15T09:00:00Z'
description: A beginner-friendly guide to Linux file permissions covering chmod, chown, special bits, and the dangerous 777 mistake that exposes servers to attack.
tags:
- linux
- file-permissions
- chmod
- sysadmin
- security
thumbnail: linux-file-permissions.png
---

If you've ever typed `ls -l` and seen a string like `-rwxr-xr-x` and wondered what it all means, this guide is for you. File permissions in Linux aren't complicated once you see the pattern, but they trip up a lot of people—especially when things break and you can't figure out why.

## Who this is for

- Developers working on Linux servers
- Junior sysadmins getting started with permissions
- Anyone who uses Linux and wants to understand the basics

## The core idea

Every file and directory in Linux has three questions answered:

1. **Who** can do what? The "who" is broken into three categories: owner, group, and everyone else.
2. **What** can they do? That's read (r), write (w), and execute (x).
3. **How** do we change it? Through `chmod` and `chown`.

That's it. Once you remember that structure, everything else clicks into place.

## Breaking down ls -l

When you run `ls -l`, each file shows a string of ten characters at the start. Let's break down what `-rwxr-xr-x` means:

```
- rwx r-x r-x
| |  |   |
| |  |   +-- Others: read and execute
| |  +------ Group: read and execute
| +---------- Owner: read, write, and execute
+------------ File type (- for file, d for directory)
```

The first character tells you if it's a file (-) or directory (d). The next nine characters are three sets of three: owner permissions, group permissions, and everyone else.

- **r** = read (view contents)
- **w** = write (modify or delete)
- **x** = execute (run as a program)

If you see a dash, that permission is denied. For example, `rw-r-----` means the owner can read and write, the group can read, and everyone else has no access.

## Numeric mode vs symbolic mode

You can set permissions in two ways. Most people start with numeric mode because it's faster once you memorize the numbers:

| Number | Permission | Meaning |
|--------|------------|---------|
| 7 | rwx | read + write + execute |
| 6 | rw- | read + write |
| 5 | r-x | read + execute |
| 4 | r-- | read only |
| 3 | -wx | write + execute |
| 2 | -w- | write only |
| 1 | --x | execute only |
| 0 | --- | no permissions |

So when you see `755`, it breaks down as: owner gets 7 (rwx), group gets 5 (r-x), and everyone else gets 5 (r-x). A common setup for scripts and directories.

`644` is another standard: owner can read and write (6), everyone else can only read (4). Perfect for config files.

Symbolic mode is more readable:

```bash
# Add execute permission for everyone
chmod +x script.sh

# Remove write permission from group
chmod g-w file.txt

# Set specific permissions
chmod u=rwx,g=rx,o=r file
```

## Special permissions

Beyond the basic read/write/execute, there are three special bits that come in handy:

### SUID (set user ID) — 4xxx

When set on an executable, the program runs as the file's owner, not the user running it. The classic example is `passwd`—it needs root access to write to `/etc/passwd`, so it runs as root regardless of who runs it. You'll see this as an `s` in the owner's execute spot:

```
-rwsr-xr-x 1 root root 68208 Apr  1 12:00 /usr/bin/passwd
```

### SGID (set group ID) — 2xxx

Similar to SUID but for groups. On a directory, files created inside inherit the directory's group. Useful for shared project directories. Shows as an `s` in the group execute spot:

```
drwxr-sr-x 2 user team 4096 May 15 10:00 /shared/project
```

### Sticky bit — 1xxx

On a directory like `/tmp`, this prevents users from deleting other users' files—even if they have write access to the directory. Shows as a `t` in the others execute spot:

```
drwxrwxrwt 5 root root 4096 May 15 10:00 /tmp
```

Set these with:

```bash
chmod u+s file      # SUID
chmod g+s directory # SGID
chmod +t directory # Sticky bit
```

## The 777 mistake — what I wish I knew earlier

Here's the biggest permission mistake beginners make: setting `777` on a file or directory.

```bash
chmod 777 myfile
```

This gives **everyone** read, write, and execute permissions. It's convenient while debugging because "everything works," but it's a serious security risk. Anyone on the system can read your files, modify them, or execute them. For executables, that's an easy path for privilege escalation. For directories, it means anyone can delete anything.

What you should do instead:

- For scripts: `chmod 755 script.sh` — executable by everyone, but only owner can modify
- For sensitive files: `chmod 600 secrets.txt` — only the owner can read or write
- For group sharing: `chmod 770 shared-folder/` — owner and group only

A quick rule: if a file doesn't need to be executable, don't make it executable. If a directory doesn't need world access, don't open it up.

## Practical commands

Here are the commands you'll use most often:

```bash
# Change permissions
chmod 755 file
chmod +x script.sh
chmod u-w file

# Change owner and group
chown user:group file
chown -R user:group directory

# Check current permissions
ls -l file
stat file
```

## What I wish I knew earlier

- **Numeric mode is your friend** — memorize 755, 644, and 777 at minimum. It saves time.
- **Always check ownership** — `chown` matters as much as `chmod`. Wrong owner breaks things just as fast as wrong permissions.
- **Directory vs file permissions** — execute on a directory means "can enter and list contents," not "can run it like a program."
- **The umask default** — when you create a new file, it starts with 666 minus your umask. Default umask is usually 022, giving you 644. Understanding this explains why new files aren't executable by default.
- **777 is almost never the answer** — if you're debugging and reach for 777, pause and think about what the real problem is.

## Next steps

Once you're comfortable with the basics, explore:

- **ACLs (Access Control Lists)** — more granular permissions beyond owner/group/others
- **umask** — controlling default permissions for new files
- ** SELinux/AppArmor** — mandatory access control beyond basic permissions

File permissions are one of those topics that seem small but matter enormously in practice. Get these right, and you'll avoid a lot of headaches down the road.

**Tags:** linux, file-permissions, chmod, sysadmin, security