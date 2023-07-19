# Changelog

# 1.0.0 (2023-07-18)

### First initialization

* First initialization

# 1.0.2 (2023-07-19)

### Added

* getRelease() - Getting the release version
* getSession() - Getting a session
* getQRCode(clientId) - Getting wg-easy client qr-code
* updateAddress(clientId, address) - Update wg-easy client address

### Fix
* rename(clientId, newName) - now it is not possible to take an existing name

# 1.0.3 (2023-07-20)

### Fix

* rename(clientId, newName) - Added a missed "await"

### Update

* Reworked catching errors. Now, in case of errors, you get an object with the variable "error"