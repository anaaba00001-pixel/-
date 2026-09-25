import * as THREE from './three.module.js';

const works = [
  {
    title: 'الفتاة ذات القرط اللؤلؤي',
    artist: 'يوهانس فيرمير',
    period: 'العصر الذهبي الهولندي',
    year: 'حوالي 1665',
    medium: 'ألوان زيتية على قماش',
    location: 'ماورتشهاوس، لاهاي',
    description:
      'التفاتة عابرة، وضوء يلامس الوجه، ولؤلؤة تختصر المشهد. ليست بورتريه لشخص معروف، بل دراسة لشخصية متخيّلة؛ يترك فيرمير هويتها مفتوحة لتأمّل المشاهد.',
    src: 'pearl.jpg',
    ratio: 0.85,
    url: 'https://www.mauritshuis.nl/en/our-collection/artworks/670-girl-with-a-pearl-earring/'
  },
  {
    title: 'ليلة النجوم',
    artist: 'فنسنت فان غوخ',
    period: 'ما بعد الانطباعية',
    year: '1889',
    medium: 'ألوان زيتية على قماش',
    location: 'متحف الفن الحديث، نيويورك',
    description:
      'سماء تتحرّك فوق قرية ساكنة. رسم فان غوخ هذا المشهد في سان ريمي، جامعًا بين المشاهدة والخيال. تتبّع دوامات الأزرق وضوء النجوم، ثم لاحظ شجرة السرو التي تصل الأرض بالسماء.',
    src: 'starry.jpg',
    ratio: 1.263,
    url: 'https://www.moma.org/collection/works/79802'
  },
  {
    title: 'القُبلة',
    artist: 'غوستاف كليمت',
    period: 'الفن الجديد · المرحلة الذهبية',
    year: '1907 – 1908',
    medium: 'زيت وورق ذهب على قماش',
    location: 'بلفيدير، فيينا',
    description:
      'عناق يحتضنه الذهب. تتداخل الزخارف الهندسية والأشكال الزهرية لتجعل الشخصيتين كأنهما جزء من فسيفساء واحدة. عمل من المرحلة الذهبية لكليمت، يستكشف القرب الإنساني بلغة اللون والزخرفة.',
    src: 'kiss.jpg',
    ratio: 1,
    url: 'https://en.wikipedia.org/wiki/The_Kiss_(Klimt)'
  }
];

const $ = (selector) => document.querySelector(selector);

let index = 0;
let close = false;
let renderer;
let scene;
let camera;
let paintingMeshes = [];
let targetX = 0;
let px = 0;
let py = 0;

const reduced = matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

$('.counter span:last-child').textContent =
  String(works.length).padStart(2, '0');

// الصور المصغرة
works.forEach((work, i) => {
  const button = document.createElement('button');

  button.className = 'thumb';
  button.setAttribute('aria-label', work.title);

  button.innerHTML = `
    <img src="${work.src}" alt="${work.title}">
  `;

  button.onclick = () => select(i);

  $('.thumbnails').append(button);
});

// اختيار لوحة وتحديث معلوماتها
function select(i) {
  index = (i + works.length) % works.length;

  const work = works[index];

  const fields = [
    'title',
    'artist',
    'period',
    'year',
    'description',
    'medium',
    'location'
  ];

  for (const key of fields) {
    $('#' + key).textContent = work[key];
  }

  $('#source').href = work.url;

  $('#number').textContent =
    String(index + 1).padStart(2, '0');

  document.querySelectorAll('.thumb').forEach((button, j) => {
    button.classList.toggle('active', index === j);
    button.setAttribute(
      'aria-current',
      index === j ? 'true' : 'false'
    );
  });

  targetX = index * 8;

  const fallbackImage = $('.fallback-art');

  if (fallbackImage) {
    fallbackImage.src = work.src;
    fallbackImage.alt = work.title;
  }
}

// أزرار التنقل
$('#next').onclick = () => select(index + 1);
$('#prev').onclick = () => select(index - 1);

// الاقتراب من اللوحة
$('#closer').onclick = () => {
  close = !close;

  document.body.classList.toggle('close-view', close);

  $('#closer span').textContent = close
    ? 'العودة إلى القاعة'
    : 'اقترب من اللوحة';

  $('#closer').setAttribute('aria-pressed', String(close));
};

// التحكم بلوحة المفاتيح
window.addEventListener('keydown', (event) => {
  if (event.target.closest('input,textarea,select')) {
    return;
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    select(index + 1);
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault();
    select(index - 1);
  }

  if (event.key === 'Escape' && close) {
    $('#closer').click();
  }
});

// السحب للتنقل
let startX = 0;
let startY = 0;

$('#scene').addEventListener('pointerdown', (event) => {
  startX = event.clientX;
  startY = event.clientY;
});

$('#scene').addEventListener('pointerup', (event) => {
  const horizontalDistance = event.clientX - startX;
  const verticalDistance = event.clientY - startY;

  if (
    Math.abs(horizontalDistance) > 55 &&
    Math.abs(verticalDistance) < 70
  ) {
    select(index + (horizontalDistance < 0 ? 1 : -1));
  }
});

window.addEventListener('pointermove', (event) => {
  px = event.clientX / innerWidth - 0.5;
  py = event.clientY / innerHeight - 0.5;
});

// ملء الشاشة
$('#fullscreen').onclick = async () => {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  } catch {
    $('#fullscreen').title =
      'ملء الشاشة غير متاح في هذا المتصفح';
  }
};

document.addEventListener('fullscreenchange', () => {
  $('#fullscreen').setAttribute(
    'aria-label',
    document.fullscreenElement
      ? 'إنهاء ملء الشاشة'
      : 'ملء الشاشة'
  );
});

select(0);

// بناء القاعة ثلاثية الأبعاد
try {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance'
  });

  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
  renderer.setSize(innerWidth, innerHeight);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;

  $('#scene').append(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color('#131c17');
  scene.fog = new THREE.Fog('#101812', 20, 55);

  camera = new THREE.PerspectiveCamera(
    46,
    innerWidth / innerHeight,
    0.1,
    80
  );

  const mat = (
    color,
    roughness = 0.8,
    metalness = 0
  ) => new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness
  });

  const wall = mat('#243a30');
  const floor = mat('#35372e', 0.33, 0.15);
  const gold = mat('#a98648', 0.28, 0.72);
  const dark = mat('#141b17');

  function box(x, y, z, width, height, depth, material) {
    const object = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      material
    );

    object.position.set(x, y, z);
    object.castShadow = true;
    object.receiveShadow = true;

    scene.add(object);

    return object;
  }

  // الجدار والأرضية والسقف
  box(8, 3, -0.25, 44, 6, 0.4, wall);
  box(8, -0.15, 6, 44, 0.3, 16, floor);
  box(8, 6, 5, 44, 0.15, 12, dark);

  // الحواف السفلية
  box(8, 0.13, 0.04, 44, 0.26, 0.12, dark);
  box(8, 0.28, 0.06, 44, 0.015, 0.015, gold);

  // تفاصيل الجدار والسقف
  for (let x = -14; x < 30; x += 4) {
    box(x, 3, 0, 0.035, 6, 0.02, mat('#182a21'));
    box(x, 5.65, 3, 0.04, 0.05, 6, dark);
  }

  // فواصل الأرضية
  for (let x = -14; x < 31; x += 2.4) {
    box(
      x, 0.006, 6,
      0.008, 0.008, 14,
      mat('#1e2922')
    );
  }

  for (let z = 1; z < 14; z += 2.4) {
    box(
      8, 0.009, z,
      44, 0.008, 0.008,
      mat('#1e2922')
    );
  }

  // الإضاءة العامة
  scene.add(
    new THREE.HemisphereLight(
      '#d9e5d9',
      '#242317',
      1.25
    )
  );

  scene.add(
    new THREE.AmbientLight('#e6c995', 0.2)
  );

  const loader = new THREE.TextureLoader();
  let completed = 0;

  works.forEach((work, i) => {
    const x = i * 8;
    const height = 2.65;
    const width = height * work.ratio;

    // الإطار
    box(
      x, 2.9, 0.1,
      width + 0.28, height + 0.28, 0.19,
      dark
    );

    box(
      x, 2.9, 0.22,
      width + 0.22, height + 0.22, 0.16,
      gold
    );

    box(
      x, 2.9, 0.315,
      width + 0.075, height + 0.075, 0.045,
      mat('#2c2316')
    );

    // تحميل الصورة من المجلد الرئيسي
    const texture = loader.load(
      work.src,
      () => {
        completed++;

        if (completed === works.length) {
          $('#loading').hidden = true;
        }
      },
      undefined,
      () => {
        $('#loading').textContent =
          'تعذّر تحميل إحدى الصور';
      }
    );

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy =
      renderer.capabilities.getMaxAnisotropy();

    const artwork = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({
        map: texture
      })
    );

    artwork.position.set(x, 2.9, 0.344);
    artwork.userData.index = i;

    scene.add(artwork);
    paintingMeshes.push(artwork);

    // تفاصيل الإطار الذهبي
    box(
      x - width / 2 - 0.07, 2.9, 0.34,
      0.035, height + 0.19, 0.035,
      gold
    );

    box(
      x + width / 2 + 0.07, 2.9, 0.34,
      0.035, height + 0.19, 0.035,
      gold
    );

    box(
      x, 2.9 + height / 2 + 0.07, 0.34,
      width + 0.19, 0.035, 0.035,
      gold
    );

    box(
      x, 2.9 - height / 2 - 0.07, 0.34,
      width + 0.19, 0.035, 0.035,
      gold
    );

    // بطاقة صغيرة على الجدار
    box(
      x + width / 2 + 0.38, 1.52, 0.06,
      0.33, 0.18, 0.02,
      mat('#b1b1a0')
    );

    // إضاءة موجهة إلى كل لوحة
    const light = new THREE.SpotLight(
      '#ffe4b3',
      65,
      13,
      0.66,
      0.8,
      1.4
    );

    light.position.set(x, 5.5, 2);
    light.target.position.set(x, 2.6, 0);

    light.castShadow = true;
    light.shadow.mapSize.set(1024, 1024);

    scene.add(light, light.target);

    box(x, 5.55, 2, 0.18, 0.12, 0.32, dark);
  });

  camera.position.set(0.75, 3.05, 8.3);

  const look = new THREE.Vector3();
  let last = performance.now();

  // تحريك الكاميرا
  function animate(now) {
    requestAnimationFrame(animate);

    const dt = Math.min((now - last) / 1000, 0.06);
    last = now;

    const mobile = innerWidth <= 700;
    const offset = mobile ? 0 : close ? 0 : 1.65;

    const destinationZ = close
      ? (mobile ? 6.8 : 5.6)
      : (mobile ? 9.8 : 8.3);

    const blend = reduced
      ? 1
      : 1 - Math.exp(-dt * 4);

    camera.position.x +=
      (targetX + offset - camera.position.x) * blend;

    camera.position.z +=
      (destinationZ - camera.position.z) * blend;

    camera.position.y = mobile
      ? (close ? 2.9 : 1.35)
      : 3.05;

    look.set(
      camera.position.x + (reduced ? 0 : px * 0.14),
      mobile
        ? (close ? 2.9 : 1.35)
        : 2.83 + (reduced ? 0 : py * 0.05),
      0
    );

    camera.lookAt(look);
    renderer.render(scene, camera);
  }

  requestAnimationFrame(animate);

  // التكيف مع حجم الشاشة
  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(innerWidth, innerHeight);
  });

  // النقر على اللوحة
  const ray = new THREE.Raycaster();

  renderer.domElement.addEventListener('click', (event) => {
    if (Math.abs(event.clientX - startX) > 8) {
      return;
    }

    const pointer = new THREE.Vector2(
      event.clientX / innerWidth * 2 - 1,
      -event.clientY / innerHeight * 2 + 1
    );

    ray.setFromCamera(pointer, camera);

    const hits = ray.intersectObjects(paintingMeshes);

    if (hits.length) {
      const selectedIndex = hits[0].object.userData.index;

      if (index !== selectedIndex) {
        select(selectedIndex);
      } else {
        $('#closer').click();
      }
    }
  });
} catch (error) {
  // عرض بديل إذا تعذّر تشغيل WebGL
  console.warn('3D view unavailable', error);

  $('#loading').hidden = true;

  const image = document.createElement('img');

  image.className = 'fallback-art';
  image.src = works[index].src;
  image.alt = works[index].title;

  $('#scene').append(image);
}
