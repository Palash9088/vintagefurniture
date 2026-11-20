(function (E) {
  'use strict';

  const scenes = {
    chair: '<path d="M74 36v92M126 36v92M74 48h52M82 64h36M82 78h36M82 92h36M82 106h36M62 128h76M70 128l-10 78M130 128l10 78M52 206h22M138 206h22"/>',
    sofa: '<path d="M36 118V86c0-14 10-24 24-24h80c14 0 24 10 24 24v32M28 118h144v46H28zM40 164v32M160 164v32M28 150h144M52 96v22M148 96v22"/>',
    bench: '<path d="M34 118h132M42 118V78h116v40M48 118l-8 78M152 118l8 78M32 196h22M154 196h22M58 96h84"/>',
    table: '<path d="M40 78c18-16 102-16 120 0M46 78c12 10 96 10 108 0M100 84v86M72 170h56M58 170l-8 22M142 170l8 22"/>',
    desk: '<path d="M32 92h136v18H32zM40 110v74M160 110v74M36 184h16M152 184h16M48 110v48h40V110M96 122h56M96 138h56M96 154h40"/>',
    nesting: '<path d="M28 96h86v12H28zM40 108v70M98 108v70M34 178h16M90 178h16M78 124h94v12H78zM90 136v42M160 136v42M84 178h16M152 178h16"/>',
    lamp: '<path d="M78 70h44l10 36H68zM100 106v62M76 168h48M86 168c0 16 28 16 28 0M92 54c6-16 16-16 16 0"/>',
    lantern: '<path d="M100 28v24M84 52h32l10 18v62l-10 18H84l-10-18V70zM84 70h32M84 132h32M100 150v28M86 178h28M92 88h16M92 108h16"/>',
    cabinet: '<path d="M48 40h104v164H48zM100 40v164M70 118h8M122 118h8M60 56h28M112 56h28M60 188h28M112 188h28"/>',
    trunk: '<path d="M36 96c8-28 120-28 128 0v78H36zM36 122h128M36 174h128M52 122v52M148 122v52M70 78c10-8 50-8 60 0"/>',
    shelf: '<path d="M40 58h120M40 112h120M40 166h120M48 58v132M152 58v132M58 78h28M58 132h40M114 132h24"/>',
    tray: '<ellipse cx="100" cy="120" rx="70" ry="36"/><ellipse cx="100" cy="120" rx="42" ry="18"/><path d="M100 102v36M82 120h36"/>',
    mirror: '<path d="M70 48c0-22 60-22 60 0v96c0 28-60 28-60 0zM64 196h72M86 176v20M114 176v20"/>',
    cushion: '<path d="M46 150c8 28 100 28 108 0 6-34-8-70-54-70S40 116 46 150zM70 112c8 10 18 14 30 14s22-4 30-14M78 136c6 6 12 8 22 8s16-2 22-8"/>'
  };

  E.art = function (scene) {
    const inner = scenes[scene] || scenes.chair;
    return '<svg viewBox="0 0 200 240" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">' + inner + '</svg>';
  };
})(window.Ecom = window.Ecom || {});
