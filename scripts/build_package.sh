#!/bin/sh

echo "Downloading latest Atom release..."
if [ "$LPHP_OS" = "linux" ]; then
  URL="https://atom.io/download/deb"
  FILE="atom-amd64.deb"
  ATOM_DIR=/usr/bin
else
  URL="https://atom.io/download/mac"
  FILE="atom.zip"
  ATOM_DIR=atom/Atom.app/Contents/Resources/app
fi

curl -s -L "$URL" \
  -H 'Accept: application/octet-stream' \
  -o "$FILE"

if [ "$LPHP_OS" = "linux" ]; then
  sudo apt-get update
  sudo apt-get install gvfs-bin
  # Install xvfb and libgtk2.0-0
  sudo apt-get install xvfb
  sudo apt-get install libgtk2.0-0
  sudo dpkg --install atom-amd64.deb || true
  sudo apt-get -f install
  APM=apm
else
  mkdir atom
  unzip -q "$FILE" -d atom
  export PATH=$PWD/$ATOM_DIR/apm/bin:$PATH
  APM="$ATOM_DIR/apm/node_modules/.bin/apm"
fi

echo "Using Atom version:"
if [ "$LPHP_OS" = "linux" ]; then
  atom -v
else
  ATOM_PATH=./atom $ATOM_DIR/atom.sh -v
fi

echo "Downloading package dependencies..."
$APM clean
$APM install

TEST_PACKAGES="${APM_TEST_PACKAGES:=none}"

if [ "$TEST_PACKAGES" != "none" ]; then
  echo "Installing atom package dependencies..."
  for pack in $TEST_PACKAGES ; do
    $APM install $pack
  done
fi

if [ -f ./node_modules/.bin/coffeelint ]; then
  if [ -d ./lib ]; then
    echo "Linting package..."
    ./node_modules/.bin/coffeelint lib
    rc=$?; if [ $rc != 0 ]; then exit $rc; fi
  fi
  if [ -d ./spec ]; then
    echo "Linting package specs..."
    ./node_modules/.bin/coffeelint spec
    rc=$?; if [ $rc != 0 ]; then exit $rc; fi
  fi
fi

if [ -f ./node_modules/.bin/eslint ]; then
  if [ -d ./lib ]; then
    echo "Linting package..."
    ./node_modules/.bin/eslint lib
    rc=$?; if [ $rc != 0 ]; then exit $rc; fi
  fi
  if [ -d ./spec ]; then
    echo "Linting package specs..."
    ./node_modules/.bin/eslint spec
    rc=$?; if [ $rc != 0 ]; then exit $rc; fi
  fi
fi

if [ -f ./node_modules/.bin/standard ]; then
  if [ -d ./lib ]; then
    echo "Linting package..."
    ./node_modules/.bin/standard lib/**/*.js
    rc=$?; if [ $rc != 0 ]; then exit $rc; fi
  fi
  if [ -d ./spec ]; then
    echo "Linting package specs..."
    ./node_modules/.bin/standard spec/**/*.js
    rc=$?; if [ $rc != 0 ]; then exit $rc; fi
  fi
fi

echo "Running specs..."
ATOM_PATH=./atom $APM test --path $ATOM_DIR/atom.sh

exit
