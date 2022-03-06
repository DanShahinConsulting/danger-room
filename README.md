# Danger Room

### Project website:
Look to the [Danger Room website](https://danshahinconsulting.github.io/danger-room/) for compiled binaries (coming soon), and we are looking for volunteers from platforms besides MacOS to help compile for those operating systems.

### Install from the command line
- `git clone https://github.com/DanShahinConsulting/danger-room.git`  to download the   [repo](https://github.com/DanShahinConsulting/danger-room.git) from Github
- `cd danger-room` 
- `yarn` to install dependencies
- `yarn start` to run in developer mode
- `yarn make` to compile binares 

### Integrate with OBS

Now you can use [OBS Studio](https://obsproject.com/) in virtual camera mode, and add the Danger Room "Stage" Window as a layer in OBS.  You can disable the Danger Room webcam and use the OBS camera alone if you don't need 3d positioning of your camera.

We're working on adding virtual camera support directly to Danger Room to eliminate the need for OBS when using Zoom or Streamyard.