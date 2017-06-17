# src/share goodies

These are things that more than one feature depended on, so they were yanked up
out of that feature directory tree and placed here, for two reasons:

1. Spooky reuse warning! Everything here is used in two places, so be careful to
   check all callers before you change their behavior
2. These are each (or in some combination) candidates for freshly extracted
   moduled if they might be useful
