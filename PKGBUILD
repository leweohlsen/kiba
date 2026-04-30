# Maintainer: Lewe Ohlsen <mail@lewe.io>
pkgname=kiba
pkgver=1.1.4
pkgrel=2
pkgdesc="Kiosk and bank system for accounts, products, and transactions"
arch=('x86_64')
url="https://github.com/leweohlsen/kiba"
license=('MIT')
depends=('alsa-lib' 'at-spi2-core' 'gtk3' 'hicolor-icon-theme' 'libnotify' 'libxss' 'libxtst' 'nss')
makedepends=('npm' 'nodejs')
source=()
sha256sums=()
options=('!strip')
install=kiba.install

build() {
  cd "$startdir"
  export npm_config_cache="$srcdir/npm-cache"
  npm ci
  npm run package
}

package() {
  cd "$startdir"

  install -dm755 "$pkgdir/usr/lib/$pkgname"
  cp -a out/kiba-linux-x64/. "$pkgdir/usr/lib/$pkgname/"
  chmod -R u+rwX,go+rX "$pkgdir/usr/lib/$pkgname"
  chmod 755 "$pkgdir/usr/lib/$pkgname/kiba"

  install -dm755 "$pkgdir/usr/bin"
  ln -s "/usr/lib/$pkgname/kiba" "$pkgdir/usr/bin/kiba"

  install -Dm644 packaging/linux/kiba.desktop "$pkgdir/usr/share/applications/kiba.desktop"
  install -Dm644 src/assets/icon.png "$pkgdir/usr/share/pixmaps/kiba.png"
  install -Dm644 src/assets/macos_icon.png "$pkgdir/usr/share/icons/hicolor/512x512/apps/kiba.png"
  install -Dm644 src/assets/macos_icon_256.png "$pkgdir/usr/share/icons/hicolor/256x256/apps/kiba.png"
}
