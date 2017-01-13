 Change Log
All notable changes to this project will be documented in this file.

## [0.4.0]
### Added
- Added file uploading
- Added help text

### Changed
- Reverted to indexing metadata via database for efficiency
- Divided functionality into multiple files.

## [0.3.0]
### Added
- Added ability to search multiple terms

### Changed
- Improved error handling
- Builds the response object and then returns it rather than hardcoding the json

### Fixed
- Fixed bad error handling (returning undefined as a valid url.)

## [0.2] - 2016-09-01
### Added
- Added Changelog file

### Changed
- Searches S3 directly rather than requiring the metadata to be put into a db for searching
- Improved instructions in the README

## [0.1] - 2016-008-19
- Initial Commit

### Added
- README.md, getmeme.js, LICENSE
