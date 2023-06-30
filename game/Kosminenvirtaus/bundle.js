(()=>{
    var e = {
        666: (e,t,n)=>{
            "use strict";
            n.r(t),
            n.d(t, {
                default: ()=>r
            });
            const r = "#define PI 3.1415927\n#define TAU (2.*PI)\n#define INF 1e10\n#define mr(t) (mat2(cos(t), sin(t), -sin(t), cos(t)))\n\nfloat hash(float x) {return fract(sin(x*3465.1367));}\nfloat hash2(vec2 x) {return hash(dot(x, vec2(12.256, 31.384584)));}\nfloat hash3(vec3 x) {return hash(dot(x, vec3(3.13515, 2.87345, 1.917263)));}\n\nvec3 srgbToLinear(vec3 p) {return p*p;}\nvec3 linearToSrgb(vec3 p) {return sqrt(p);}\n\nconst vec3 maxAbsPos = vec3(2., 2., 1.);\n\nbool isOutOfSight(mat4 proj, mat4 view, vec3 position, out vec4 screenPosition) {\n  screenPosition = proj * view * vec4(position, 1.);\n  screenPosition.xyz /= screenPosition.w;\n  // screenPosition.z -= .5;\n  return any(greaterThan(abs(screenPosition.xyz), maxAbsPos));\n}\n\nvec3 generateRandomPosition(vec4 screenPosition, mat4 u_invprojview, int vertexId, float time, float zminFactor) {\n    float vid = float(vertexId);\n    screenPosition = vec4(\n      (hash(vid + .5*time + 5.*hash3(screenPosition.xyz)) - .5) * 2. * maxAbsPos.x,\n      (hash(3.2*vid + .3*time + 13.*hash3(screenPosition.yzx + .345)) - .5) * 2. * maxAbsPos.y,\n      //mix(1., 1., hash(vid + .8*time + 13.*hash3(screenPosition.zxy + .123))),\n      1.,\n      1.);\n    vec4 globalPosition = u_invprojview * screenPosition;\n    return globalPosition.xyz/globalPosition.w;\n}"
        }
        ,
        835: (e,t,n)=>{
            "use strict";
            n.r(t),
            n.d(t, {
                default: ()=>r
            });
            const r = "in float i_position;\nvoid main() { discard; }"
        }
        ,
        650: (e,t,n)=>{
            "use strict";
            n.r(t),
            n.d(t, {
                default: ()=>r
            });
            const r = "in vec3 i_position;\nin vec3 i_speed;\n\nout vec3 v_position;\nout vec3 v_speed;\n\nuniform float time;\nuniform float dt;\nuniform int figure;\nuniform int compute_collision;\nuniform mat4 u_proj;\nuniform mat4 u_view;\nuniform mat4 u_invprojview;\n\n#define rep(p, s) (mod(p, s) - s/2.)\n#define rep2(p, s) (abs(rep(p, 2.*s)) - s/2.)\n\nfloat noise(float t, float h) {\n  float fl = floor(t), fr = fract(t);\n  fr = smoothstep(0., 1., fr);\n  return mix(hash(fl+h), hash(fl+h+1.), fr);\n}\n\nfloat box(vec3 p, vec3 s) {\n  p = abs(p) - s;\n  return max(max(p.x, p.y), p.z);\n}\n\nfloat box2(vec2 p, vec2 s) {\n  p = abs(p) - s;\n  return max(p.x, p.y);\n}\n\nfloat sdCross(vec3 p, vec2 s) {\n  p = abs(p);\n  if (p.y < p.z) p.yz = p.zy;\n  if (p.x < p.y) p.xy = p.yx;\n  return box2(p.yz, s);\n}\n\nfloat crosses(vec3 p) {\n  float modSize = 12.;\n  float pc = floor(p.z/modSize);\n  float dir = mix(-1., 1., mod(pc, 2.));\n  p.x += dir;\n  p.z = rep(p.z, modSize);\n  vec2 size = vec2(2.5, .05);\n  p.xy *= mr(time*dir*.2);\n  float m = min(box(p, size.xyy), box(p, size.yxy));\n  return m;\n}\n\nfloat path1(vec3 p) {\n  float m = INF;\n  for (int i=0;i<3;++i) {\n    vec3 p1 = p;\n    p1.xy += 3.*sin(p1.z * .5 * vec2(.2, .3) + float(i)/3.*TAU);\n    m = min(m, length(p1.xy) - .03);\n  }\n  return m;\n}\n\nfloat obst1(vec3 p) {\n  float modSize = 10.;\n  float pc = floor(p.z/modSize);\n  float dir = mix(-1., 1., mod(pc, 2.));\n  p.xy *= mr(time*.2);\n  p.z = rep(p.z, modSize);\n  float m = max(length(p.xy)-2., abs(p.z)-.1);\n  p.x -= .1*dir;\n  m = max(m, p.x*dir);\n  return m;\n}\n\nfloat dots(vec3 p) {\n  p.xy *= mr(time*.2);\n  p.xz += vec2(1., .3) * .5 * time;\n  float modSize = 6.;\n  p.xy *= mr(.4);\n  p.yz *= mr(.3);\n  p.xz = rep2(p.xz, vec2(modSize));\n  return length(p.xz)-.05;\n}\n\nfloat ifs1(vec3 p) {\n  vec3 s = vec3(12.);\n  for(int i=0;i<2;++i) {\n    p = rep2(p, s);\n    s *= .5;\n    p.xz *= mr(PI/4.);\n    p.yz *= mr(PI/4.);\n  }\n  return length(p.xy)-.03;\n}\n\nfloat boxesRot(vec3 p) {\n  float modSize = 6.;\n  float pc = floor(p.z/modSize);\n  p.xy *= mr(pc*.8);\n  p.x -= .8;\n  p.z = rep(p.z, modSize);\n  return box(p, vec3(.5, 1., .1));\n}\n\nfloat lattice(vec3 p) {\n  p.xz *= mr(PI/4.);\n  p.yz *= mr(PI/6.);\n  p = rep2(p, vec3(10.));\n  p.xz *= mr(time*.05);\n  return sdCross(p, vec2(.01));\n}\n\nfloat outwind(vec3 p) {\n  float modSize = 8.;\n  float pc = floor(p.z/modSize);\n  p.xy += 3.*(hash(pc)-.5);\n  p.z = rep(p.z, modSize);\n  p.xy = abs(p.xy);\n  if (p.x < p.y) p.xy = p.yx;\n  p.x = rep(p.x, 4.);\n  return max(abs(p.x) - .01, abs(p.z)-.01);\n}\n\n\nfloat map(vec3 p) {\n  p.xy += 1.3*sin(p.z * .3 * vec2(.2, .3));\n  p.xy += 1.4*sin(p.z * .3 * vec2(.41, .64));\n\n  float m = INF;\n  if (figure == 0) {\n    m = length(p.xy) - .1;\n  } else if (figure == 1) {\n    m = crosses(p);\n  } else if (figure == 2) {\n    m = path1(p);\n  } else if (figure == 3) {\n    m = obst1(p);\n  } else if (figure == 4) {\n    m = dots(p);\n  } else if (figure == 5) {\n    m = lattice(p);\n  } else if (figure == 6) {\n    m = boxesRot(p);\n  } else if (figure == 7) {\n    m = ifs1(p);\n  } else if (figure == 8) {\n    m = outwind(p);\n  } else if (figure == 20) {\n    p.z += FINAL_DIST;\n    p.xz *= mr(time);\n    p = abs(p);\n    m = dot(p, normalize(vec3(1.)))-2.;\n  }\n  m = max(m, length(p.xy)-4.);\n  return m;\n}\n\nvec4 mnormal(vec3 p) {\n  vec2 E = vec2(.001, .0);\n  float m = map(p);\n  vec3 normal = normalize(vec3(\n    map(p+E.xyy),\n    map(p+E.yxy),\n    map(p+E.yyx)\n  ) - m);\n  return vec4(m, normal);\n}\n\nvec3 randAcc() {\n  float vid = float(gl_VertexID);\n  float freq = hash(vid*.123);\n  float t = time*freq;\n  vec3 randDir = vec3(\n    noise(t, vid*.361),\n    noise(t*1.3, vid*.825),\n    noise(t*1.4, vid*.717)\n  );\n  randDir -= .5;\n  randDir = normalize(randDir);\n  return 5. * randDir;\n}\n\nvoid main() {\n  if (compute_collision > 0) {\n    v_position = vec3(map(i_position), 0., 0.);\n    return;\n  }\n\n  vec4 mn = mnormal(i_position);\n  float m = mn.x;\n  \n  vec3 acc;\n  float maxSpeed;\n  float airFriction;\n  acc = randAcc();\n  if (m > 0.) {\n    vec3 n = mn.yzw;\n    acc += -100.*m*m*n;\n    maxSpeed = 1.;\n    airFriction = .1;\n  } else {\n    maxSpeed = 1.;\n    airFriction = 0.;\n  }\n\n  v_speed = i_speed + acc * dt;\n  v_speed = normalize(v_speed) * min(length(v_speed) - airFriction * dt, maxSpeed);\n  v_position = i_position + v_speed * dt;\n\n  vec4 screenPosition;\n  if (isOutOfSight(u_proj, u_view, v_position, screenPosition)) {\n    v_position = generateRandomPosition(screenPosition, u_invprojview, gl_VertexID, time, 1.);\n    int I = 15;\n    for (int i=0; i<I; ++i) {\n      vec4 mn = mnormal(v_position);\n      v_position -= mn.x * mn.yzw;\n    }\n  }\n}"
        }
        ,
        153: (e,t,n)=>{
            "use strict";
            n.r(t),
            n.d(t, {
                default: ()=>r
            });
            const r = "in vec3 i_position;\nin vec3 i_speed;\n\nout vec3 v_position;\nout vec3 v_speed;\n\nuniform float time;\nuniform float dt;\nuniform mat4 u_proj;\nuniform mat4 u_view;\nuniform mat4 u_invprojview;\n\nvoid main() {\n  v_speed = i_speed;\n  v_position = i_position + v_speed * dt;\n\n  vec4 screenPosition;\n  if (isOutOfSight(u_proj, u_view, v_position, screenPosition)) {\n    v_position = generateRandomPosition(screenPosition, u_invprojview, gl_VertexID, time, 1.);\n  }\n}"
        }
        ,
        426: (e,t,n)=>{
            "use strict";
            n.r(t),
            n.d(t, {
                default: ()=>r
            });
            const r = "in vec2 v_dir;\nin float v_fog;\n\nout vec4 outColor;\n\nuniform vec3 color;\n\nvec3 particle(vec2 p) {\n  float dist = 0.1;\n  vec3 c = vec3(0.);\n  for (int i=0; i<3; ++i) {\n    float theta = 2./3.*PI*float(i);\n    vec2 p1 = p + dist*vec2(vec2(cos(theta), sin(theta)));\n    float len = length(p1);\n    len *= len;\n    c[i] += 1. * smoothstep(.9, .2, len);\n  }\n  return c;\n}\n\nvoid main(void) {\n  vec2 uv = gl_PointCoord*2.-1.;\n  uv.y = -uv.y;\n\n  vec3 c = particle(uv) * color * v_fog;\n  outColor = vec4(c, 1.);\n}"
        }
        ,
        628: (e,t,n)=>{
            "use strict";
            n.r(t),
            n.d(t, {
                default: ()=>r
            });
            const r = "in vec3 i_position;\nin vec3 i_speed;\n\nout vec2 v_dir;\nout float v_fog;\n\nuniform mat4 u_proj;\nuniform mat4 u_view;\nuniform float size;\n\nvec4 project(vec3 p) {\n  return u_proj * u_view * vec4(p, 1.);\n}\n\nvoid main() {\n  vec4 p = project(i_position);\n  gl_Position = p;\n  gl_PointSize = size / p.w;\n  // vec4 d1 = u_view * vec4(normalize(i_speed), 1.);\n  // v_dir = d1.xy;\n  //v_fog = exp(-p.z / p.w * 3.);\n  v_fog = smoothstep(1., 0.99, p.z/p.w);\n}"
        }
        ,
        512: (e,t,n)=>{
            "use strict";
            n.r(t),
            n.d(t, {
                default: ()=>r
            });
            const r = "uniform sampler2D prevTex;\nuniform sampler2D newTex;\nuniform vec2 res;\nuniform float t;\nuniform float dt;\n\nout vec4 outColor;\n\nvec3 tex(sampler2D s, vec2 p, float lod) {return textureLod(s, p, lod).rgb;}\n\nvec3 fakeBloom(vec2 uv) {\n  float I = 64.;\n  vec3 col = vec3(0.);\n  for (float i=0.;i<I;++i) {\n    float angle = TAU*hash2(uv + i*.131 + t);\n    vec2 dir = vec2(cos(angle), sin(angle));\n    float len = exp(-5.*hash2(uv*2.151 + .123*i + .58*t));\n    float p = exp(-len);\n    len *= res.y*.3;\n    vec2 offset = len*dir/res;\n    float lod = log2(len)-1.;\n    col += p * tex(newTex, uv + offset, lod)/I;\n  }\n  return col;\n}\n\nvoid main(void) {\n  vec2 uv = gl_FragCoord.xy / res;\n\n  vec3 col = vec3(0.);\n  col += tex(newTex, uv, 1.);\n  col += .5*fakeBloom(uv);\n\n  col = mix(\n    col,\n    srgbToLinear(tex(prevTex, uv, 1.).rgb),\n    .4\n  );\n\n  outColor = vec4(linearToSrgb(col), 1.);\n}"
        }
        ,
        886: (e,t,n)=>{
            "use strict";
            n.r(t),
            n.d(t, {
                default: ()=>r
            });
            const r = "out vec4 outColor;\n\nuniform sampler2D tex;\nuniform vec2 res;\nuniform float energy;\nuniform int energyState;\nuniform float progress;\nuniform float blackout;\n\n#define BLUE_COL vec3(.5, .7, 1.)\n#define WHITE_COL vec3(1.)\n#define RED_COL vec3(1., .7, .5)\n\nvec4 renderUi(vec2 uv) {\n  float l = length(uv);\n  float delta = 3./res.y;\n\n  vec2 s = vec2(0.032, 0.03);\n  float energyBorder = smoothstep(s.x, s.x-delta, l);\n  energyBorder *= smoothstep(s.y-delta, s.y, l);\n  float energyCircle = smoothstep(s.x*energy, s.x*energy-delta, l);\n\n  float ang = mod(atan(uv.x, uv.y)+TAU, TAU);\n  vec2 s1 = vec2(0.05, 0.04);\n  float progressBorder = smoothstep(s1.x, s1.x-delta, l);\n  progressBorder *= smoothstep(s1.y-delta, s1.y, l);\n  progressBorder *= mix(0., 1., sin(ang*40.)*.5+.5);\n  progressBorder *= step(ang / TAU, progress);\n\n  vec3 col;\n  if(l > s.x) col = BLUE_COL;\n  else if (energyState == 0) col = WHITE_COL;\n  else if (energyState == 1) col = BLUE_COL;\n  else if (energyState == 2) col = RED_COL;\n  return vec4(col, progressBorder + energyBorder + energyCircle*0.5);\n}\n\nvoid main(void) {\n  outColor = texture(tex, gl_FragCoord.xy/res);\n  vec2 uv = gl_FragCoord.xy/res*2. - 1.;\n  uv.x *= res.x / res.y;\n  vec4 ui = renderUi(uv);\n  outColor.rgb = mix(outColor.rgb, ui.rgb, ui.a);\n  outColor.rgb *= blackout;\n}"
        }
        ,
        709: (e,t,n)=>{
            "use strict";
            n.r(t),
            n.d(t, {
                default: ()=>r
            });
            const r = "in vec2 i_pos;\n\nvoid main() {\n  gl_Position = vec4(i_pos, 0., 1.);\n}\n"
        }
        ,
        646: (e,t,n)=>{
            var r = {
                "./common.glsl": 666,
                "./discard.frag.glsl": 835,
                "./particle_comp.vert.glsl": 650,
                "./particle_comp_floating.vert.glsl": 153,
                "./particle_render.frag.glsl": 426,
                "./particle_render.vert.glsl": 628,
                "./pass1.frag.glsl": 512,
                "./screen.frag.glsl": 886,
                "./simple.vert.glsl": 709
            };
            function i(e) {
                var t = o(e);
                return n(t)
            }
            function o(e) {
                if (!n.o(r, e)) {
                    var t = new Error("Cannot find module '" + e + "'");
                    throw t.code = "MODULE_NOT_FOUND",
                    t
                }
                return r[e]
            }
            i.keys = function() {
                return Object.keys(r)
            }
            ,
            i.resolve = o,
            e.exports = i,
            i.id = 646
        }
    }
      , t = {};
    function n(r) {
        if (t[r])
            return t[r].exports;
        var i = t[r] = {
            exports: {}
        };
        return e[r](i, i.exports, n),
        i.exports
    }
    n.d = (e,t)=>{
        for (var r in t)
            n.o(t, r) && !n.o(e, r) && Object.defineProperty(e, r, {
                enumerable: !0,
                get: t[r]
            })
    }
    ,
    n.o = (e,t)=>Object.prototype.hasOwnProperty.call(e, t),
    n.r = e=>{
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    (()=>{
        "use strict";
        var e = [1557, 1617, 1491, 1422, 1277, 1356, 1188, 1116].map((e=>e / 44100))
          , t = [225, 556, 441, 341];
        function r(e) {
            var t = e.createDelay(1)
              , n = e.createBiquadFilter();
            n.Q.value = -3.0102999566398125,
            n.type = "lowpass",
            t.dampening = n.frequency;
            var r = e.createGain();
            return t.resonance = r.gain,
            t.connect(n),
            n.connect(r),
            r.connect(t),
            t.dampening.value = 3e3,
            t.delayTime.value = .1,
            t.resonance.value = .5,
            t
        }
        const i = (e,t,n)=>e * (1 - n) + t * n
          , o = (e,t)=>Math.exp(60 * e * t)
          , a = (e,t,n)=>((e,t,n)=>Math.max(t, Math.min(n, e)))((n - e) / (t - e), 0, 1)
          , s = (e,t)=>e.map((e=>e * t));
        class c {
            constructor(e) {
                this.values = e
            }
            static id() {
                return new c([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
            }
            static rotation(e, t, n) {
                const r = this.id();
                let[i,o] = [Math.cos(e), Math.sin(e)];
                return r.set(t, t, i),
                r.set(t, n, o),
                r.set(n, t, -o),
                r.set(n, n, i),
                r
            }
            static perspective(e, t, n, r) {
                var i = 1 / Math.tan(e / 2)
                  , o = 1 / (n - r);
                return new c([i / t, 0, 0, 0, 0, i, 0, 0, 0, 0, (n + r) * o, -1, 0, 0, n * r * o * 2, 0])
            }
            static translate(e) {
                return new c([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, e[0], e[1], e[2], 1])
            }
            at(e, t) {
                return this.values[4 * t + e]
            }
            set(e, t, n) {
                this.values[4 * t + e] = n
            }
            mulVec(e) {
                return e.map(((t,n)=>this.at(n, 0) * e[0] + this.at(n, 1) * e[1] + this.at(n, 2) * e[2] + this.at(n, 3) * e[3]))
            }
            mul(e) {
                const t = (t,n)=>this.at(t, 0) * e.at(0, n) + this.at(t, 1) * e.at(1, n) + this.at(t, 2) * e.at(2, n) + this.at(t, 3) * e.at(3, n);
                return new c([...Array(16)].map(((e,n)=>t(n % 4, Math.floor(n / 4)))))
            }
            invert() {
                let e = []
                  , [t,n,r,i,o,a,s,l,u,m,f,p,d,h,v,g] = this.values;
                e[0] = m * v * l - h * f * l + h * s * p - a * v * p - m * s * g + a * f * g,
                e[4] = d * f * l - u * v * l - d * s * p + o * v * p + u * s * g - o * f * g,
                e[8] = u * h * l - d * m * l + d * a * p - o * h * p - u * a * g + o * m * g,
                e[12] = d * m * s - u * h * s - d * a * f + o * h * f + u * a * v - o * m * v,
                e[1] = h * f * i - m * v * i - h * r * p + n * v * p + m * r * g - n * f * g,
                e[5] = u * v * i - d * f * i + d * r * p - t * v * p - u * r * g + t * f * g,
                e[9] = d * m * i - u * h * i - d * n * p + t * h * p + u * n * g - t * m * g,
                e[13] = u * h * r - d * m * r + d * n * f - t * h * f - u * n * v + t * m * v,
                e[2] = a * v * i - h * s * i + h * r * l - n * v * l - a * r * g + n * s * g,
                e[6] = d * s * i - o * v * i - d * r * l + t * v * l + o * r * g - t * s * g,
                e[10] = o * h * i - d * a * i + d * n * l - t * h * l - o * n * g + t * a * g,
                e[14] = d * a * r - o * h * r - d * n * s + t * h * s + o * n * v - t * a * v,
                e[3] = m * s * i - a * f * i - m * r * l + n * f * l + a * r * p - n * s * p,
                e[7] = o * f * i - u * s * i + u * r * l - t * f * l - o * r * p + t * s * p,
                e[11] = u * a * i - o * m * i - u * n * l + t * m * l + o * n * p - t * a * p,
                e[15] = o * m * r - u * a * r + u * n * s - t * m * s - o * n * f + t * a * f;
                let x = t * e[0] + n * e[4] + r * e[8] + i * e[12];
                if (0 === x)
                    throw new Error("Can't invert matrix, determinant is 0");
                for (let t = 0; t < e.length; t++)
                    e[t] /= x;
                return new c(e)
            }
        }
        const l = {
            mouseSens: .001,
            maxMovement: .04,
            hitPathDistance: .2,
            hitObstDistance: .2,
            hitFinalDistance: .2,
            camParams: [Math.PI / 3, .1, 15],
            baseFloatingSpeed: .2,
            floatingParticleCount: 100,
            obsctacleParticleCount: 5e4,
            finalDist: 1e3,
            maxSpeed: 6,
            movementDampingLog: Math.log(.02),
            movementPower: 1,
            energySpeedHitPath: .3,
            energySpeedHitObst: -10,
            energySpeedNone: -.1,
            invincibleTime: 3,
            deathPosDrop: 50,
            floatingColor: "ffffff",
            pathColor: "7374FF",
            obstacleColor: "FF9A61",
            finalColor: "ffffff"
        };
        function u(e, t, n=e.LINEAR) {
            let r = e.createTexture();
            e.bindTexture(e.TEXTURE_2D, r),
            e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, n),
            e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR),
            e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE),
            e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE),
            e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, t[0], t[1], 0, e.RGBA, e.UNSIGNED_BYTE, null);
            let i = e.createFramebuffer();
            return e.bindFramebuffer(e.FRAMEBUFFER, i),
            e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, r, 0),
            {
                tex: r,
                fb: i
            }
        }
        function m(e, t, n) {
            const r = e.createBuffer();
            return e.bindBuffer(e.ARRAY_BUFFER, r),
            e.bufferData(e.ARRAY_BUFFER, new Float32Array(t), n),
            r
        }
        class f {
            constructor(e, t, r, i, o) {
                this.gl = e;
                const a = e=>n(646)(`./${e}`).default;
                null == i && (i = ""),
                i += "\n" + a("common.glsl");
                const s = this.loadShader(e, e.VERTEX_SHADER, a(t), t, i)
                  , c = this.loadShader(e, e.FRAGMENT_SHADER, a(r), r, i)
                  , l = e.createProgram();
                if (this.program = l,
                e.attachShader(l, s),
                e.attachShader(l, c),
                o && e.transformFeedbackVaryings(l, o, e.INTERLEAVED_ATTRIBS),
                e.linkProgram(l),
                !e.getProgramParameter(l, e.LINK_STATUS)) {
                    let t = `Unable to link the shader program: ${e.getProgramInfoLog(l)}`;
                    throw e.deleteProgram(l),
                    new Error(t)
                }
            }
            loadShader(e, t, n, r, i) {
                const o = e.createShader(t);
                let a = "#version 300 es\n";
                if (a += "precision mediump float;\n",
                a += `${i}\n`,
                a += n,
                e.shaderSource(o, a),
                e.compileShader(o),
                !e.getShaderParameter(o, e.COMPILE_STATUS)) {
                    let t = `An error occurred compiling ${r}: ${e.getShaderInfoLog(o)}`;
                    throw e.deleteShader(o),
                    new Error(t)
                }
                return o
            }
            attrLoc(e) {
                return this.gl.getAttribLocation(this.program, e)
            }
            uniformLoc(e) {
                return this.gl.getUniformLocation(this.program, e)
            }
        }
        class p {
            init(e, t) {}
            resize(e, t) {}
            swap() {}
            getReadTex() {
                throw new Error("Can't getReadTex on ScreenRenderBuffer")
            }
            getWriteFb() {
                return null
            }
            getSize(e) {
                return e
            }
        }
        class d {
            constructor(e=1, t=null) {
                this.div = e,
                this.filter = t
            }
            init(e, t) {
                var n;
                this.texFb = u(e, t, null !== (n = this.filter) && void 0 !== n ? n : e.LINEAR)
            }
            resize(e, t) {
                e.bindTexture(e.TEXTURE_2D, this.texFb.tex),
                e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, t[0] / this.div, t[1] / this.div, 0, e.RGBA, e.UNSIGNED_BYTE, null)
            }
            swap() {}
            getSize(e) {
                return [e[0] / this.div, e[1] / this.div]
            }
            getReadTex() {
                return this.texFb.tex
            }
            getWriteFb() {
                return this.texFb.fb
            }
        }
        class h {
            constructor(e=1, t=null) {
                this.div = e,
                this.filter = t
            }
            init(e, t) {
                var n, r;
                this.read = u(e, t, null !== (n = this.filter) && void 0 !== n ? n : e.LINEAR),
                this.write = u(e, t, null !== (r = this.filter) && void 0 !== r ? r : e.LINEAR)
            }
            resize(e, t) {
                for (let n of [this.read, this.write])
                    e.bindTexture(e.TEXTURE_2D, n.tex),
                    e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, t[0] / this.div, t[1] / this.div, 0, e.RGBA, e.UNSIGNED_BYTE, null)
            }
            swap() {
                [this.read,this.write] = [this.write, this.read]
            }
            getSize(e) {
                return [e[0] / this.div, e[1] / this.div]
            }
            getReadTex() {
                return this.read.tex
            }
            getWriteTex() {
                return this.write.tex
            }
            getWriteFb() {
                return this.write.fb
            }
        }
        class v {
            constructor(e, t, n, r) {
                this.gl = e,
                this.renderTargets = t,
                this.programs = n,
                this.size = r,
                this.buffer = function(e) {
                    return m(e, [1, 1, -1, 1, 1, -1, -1, -1], e.STATIC_DRAW)
                }(e);
                for (let n of Object.values(t))
                    n.init(e, r)
            }
            resize(e) {
                e && (this.size = e);
                for (let e of Object.values(this.renderTargets))
                    e.resize(this.gl, this.size)
            }
            bindOutput(e, t=!0) {
                const n = this.gl;
                n.bindFramebuffer(n.FRAMEBUFFER, e.getWriteFb());
                const r = e.getSize(this.size);
                return n.viewport(0, 0, r[0], r[1]),
                t && e.swap(),
                r
            }
            renderPassBegin(e, t, n) {
                const r = this.gl
                  , i = this.bindOutput(t, !1);
                r.bindVertexArray(null),
                r.bindBuffer(r.ARRAY_BUFFER, this.buffer);
                const o = n.attrLoc("i_pos");
                return r.vertexAttribPointer(o, 2, r.FLOAT, !1, 0, 0),
                r.enableVertexAttribArray(o),
                r.useProgram(n.program),
                e && e.forEach(((e,t)=>{
                    r.activeTexture(r.TEXTURE0 + t),
                    r.bindTexture(r.TEXTURE_2D, e.getReadTex())
                }
                )),
                t.swap(),
                {
                    program: n,
                    size: i
                }
            }
            renderPassCommit() {
                const e = this.gl;
                e.drawArrays(e.TRIANGLE_STRIP, 0, 4)
            }
        }
        class g {
            constructor(e, t, n) {
                e.requestPointerLock(),
                e.onclick = ()=>{
                    e.requestPointerLock()
                }
                ;
                const r = e=>{
                    t(e.movementX * l.mouseSens, e.movementY * l.mouseSens)
                }
                  , i = ()=>{
                    document.pointerLockElement === e ? document.addEventListener("mousemove", r) : document.removeEventListener("mousemove", r)
                }
                ;
                document.addEventListener("pointerlockchange", i),
                document.addEventListener("mozpointerlockchange", i),
                document.addEventListener("keydown", (e=>n(e.key)))
            }
        }
        const x = (e,t)=>{
            let n = [parseInt(e.substr(0, 2), 16) / 255, parseInt(e.substr(2, 2), 16) / 255, parseInt(e.substr(4, 2), 16) / 255];
            return n = s((2,
            n.map((e=>Math.pow(e, 2)))), t),
            n
        }
        ;
        class T {
            constructor(e) {
                this.gl = e
            }
            static init(e) {
                const t = (e,t,n)=>new f(e,t[0],t[1],n,t.slice(2))
                  , n = ["discard.frag.glsl", "v_position", "v_speed"];
                this.computeProgram = t(e, ["particle_comp.vert.glsl", ...n], `#define FINAL_DIST ${l.finalDist.toFixed(1)}`),
                this.computeFloatingProgram = t(e, ["particle_comp_floating.vert.glsl", ...n]),
                this.renderProgram = t(e, ["particle_render.vert.glsl", "particle_render.frag.glsl"])
            }
            createVertexArray(e, t, n, r, i) {
                const o = e.createVertexArray();
                e.bindVertexArray(o),
                e.bindBuffer(e.ARRAY_BUFFER, n);
                let a = 0;
                for (const {name: n, numComponents: o} of i) {
                    const i = t.attrLoc(n);
                    i < 0 || (e.enableVertexAttribArray(i),
                    e.vertexAttribPointer(i, o, e.FLOAT, !1, r, a),
                    a += 4 * o)
                }
                return o
            }
            makeTransformFeedback(e, t) {
                const n = e.createTransformFeedback();
                return e.bindTransformFeedback(e.TRANSFORM_FEEDBACK, n),
                e.bindBufferBase(e.TRANSFORM_FEEDBACK_BUFFER, 0, t),
                n
            }
            generateInitData() {
                const e = [];
                for (let t = 0; t < this.numParticles; ++t)
                    e.push(...this.initialGenerator());
                return e
            }
            createBufferWithArray(e) {
                const t = m(e, this.generateInitData(), e.STREAM_DRAW)
                  , n = m(e, Array(6 * T.COLLISION_BUFFER_SIZE).fill(0), e.STREAM_DRAW)
                  , r = [{
                    name: "i_position",
                    numComponents: 3
                }, {
                    name: "i_speed",
                    numComponents: 3
                }];
                return {
                    buffer: t,
                    computeVAO: this.createVertexArray(e, this.computeProgram, t, 24, r),
                    renderVAO: this.createVertexArray(e, this.renderProgram, t, 24, r),
                    collisionBuffer: n,
                    computeCollisionVAO: this.createVertexArray(e, this.computeProgram, n, 24, r),
                    tf: this.makeTransformFeedback(e, t),
                    collisionTf: this.makeTransformFeedback(e, n)
                }
            }
            init() {
                const e = this.gl;
                this.renderProgram = T.renderProgram,
                this.read = this.createBufferWithArray(e),
                this.write = this.createBufferWithArray(e),
                e.bindBuffer(e.ARRAY_BUFFER, null),
                e.bindBuffer(e.TRANSFORM_FEEDBACK_BUFFER, null)
            }
            delete() {
                [this.read, this.write].forEach((e=>{
                    this.gl.deleteBuffer(e.buffer),
                    this.gl.deleteBuffer(e.collisionBuffer),
                    this.gl.deleteVertexArray(e.computeVAO),
                    this.gl.deleteVertexArray(e.renderVAO),
                    this.gl.deleteVertexArray(e.computeCollisionVAO),
                    this.gl.deleteTransformFeedback(e.tf),
                    this.gl.deleteTransformFeedback(e.collisionTf)
                }
                ))
            }
            setupComputeProgram(e, t, n, r) {
                let i = this.computeProgram;
                t.useProgram(i.program),
                t.uniform1f(i.uniformLoc("time"), e.time),
                t.uniform1f(i.uniformLoc("dt"), e.dt),
                t.uniform1i(i.uniformLoc("compute_collision"), n ? 1 : 0),
                r && (t.uniformMatrix4fv(i.uniformLoc("u_proj"), !1, r.proj.values),
                t.uniformMatrix4fv(i.uniformLoc("u_view"), !1, r.view.values),
                t.uniformMatrix4fv(i.uniformLoc("u_invprojview"), !1, r.invProjView.values))
            }
            updateAndRender(e, t, n) {
                const r = this.gl;
                this.setupComputeProgram(e, r, !1, t),
                r.bindVertexArray(this.read.computeVAO),
                r.enable(r.RASTERIZER_DISCARD),
                r.bindTransformFeedback(r.TRANSFORM_FEEDBACK, this.write.tf),
                r.beginTransformFeedback(r.POINTS),
                r.drawArrays(r.POINTS, 0, this.numParticles),
                r.endTransformFeedback(),
                r.bindTransformFeedback(r.TRANSFORM_FEEDBACK, null),
                r.disable(r.RASTERIZER_DISCARD),
                r.enable(r.BLEND),
                r.blendFunc(r.ONE, r.ONE);
                let i = this.renderProgram;
                r.useProgram(i.program),
                r.bindVertexArray(this.write.renderVAO);
                const o = this.particleColor;
                r.uniform3f(i.uniformLoc("color"), o[0], o[1], o[2]),
                r.uniform1f(i.uniformLoc("size"), this.particleSize * n),
                r.uniformMatrix4fv(i.uniformLoc("u_view"), !1, t.view.values),
                r.uniformMatrix4fv(i.uniformLoc("u_proj"), !1, t.proj.values),
                r.drawArrays(r.POINTS, 0, this.numParticles),
                r.disable(r.BLEND),
                [this.read,this.write] = [this.write, this.read]
            }
        }
        T.COLLISION_BUFFER_SIZE = 64;
        class _ extends T {
            constructor(e) {
                super(e),
                this.particleColor = x(l.floatingColor, .15),
                this.particleSize = .08,
                this.numParticles = l.floatingParticleCount,
                this.computeProgram = T.computeFloatingProgram,
                this.init()
            }
            initialGenerator() {
                const e = ()=>2 * Math.random() - 1
                  , t = l.baseFloatingSpeed;
                return [0, 0, 500, t * e(), t * e(), t * e()]
            }
        }
        class b extends T {
            constructor(e, t) {
                super(e),
                this.figure = 0,
                this.particleColor = x(t, .3),
                this.particleSize = .03,
                this.numParticles = l.obsctacleParticleCount,
                this.computeProgram = T.computeProgram,
                this.init()
            }
            hitTest(e, t) {
                const n = this.gl;
                n.bindBuffer(n.ARRAY_BUFFER, this.read.collisionBuffer);
                const r = [];
                for (let e = 0; e < T.COLLISION_BUFFER_SIZE; ++e)
                    r.push(t[0], t[1], t[2], 0, 0, 0);
                n.bufferData(n.ARRAY_BUFFER, new Float32Array(r), n.STREAM_DRAW),
                this.setupComputeProgram(e, n, !0),
                n.bindVertexArray(this.read.computeCollisionVAO),
                n.enable(n.RASTERIZER_DISCARD),
                n.bindTransformFeedback(n.TRANSFORM_FEEDBACK, this.write.collisionTf),
                n.beginTransformFeedback(n.POINTS),
                n.drawArrays(n.POINTS, 0, T.COLLISION_BUFFER_SIZE),
                n.endTransformFeedback(),
                n.bindTransformFeedback(n.TRANSFORM_FEEDBACK, null),
                n.disable(n.RASTERIZER_DISCARD),
                n.bindBuffer(n.ARRAY_BUFFER, this.write.collisionBuffer);
                var i = new Float32Array(6 * T.COLLISION_BUFFER_SIZE);
                n.getBufferSubData(n.ARRAY_BUFFER, 0, i),
                n.bindBuffer(n.ARRAY_BUFFER, null);
                let o = Number.MAX_VALUE;
                for (let e = 0; e < i.length; e += 6)
                    o = Math.min(o, i[e]);
                return o
            }
            initialGenerator() {
                const e = ()=>2 * Math.random() - 1;
                return [0, 0, 100, 1 * e(), 1 * e(), 1 * e()]
            }
            setupComputeProgram(e, t, n, r) {
                super.setupComputeProgram(e, t, n, r);
                let i = this.computeProgram;
                t.uniform1i(i.uniformLoc("figure"), this.figure)
            }
        }
        let E = {
            fps: 0,
            frames: 0,
            lastTimeCheck: 0,
            update(e) {
                this.frames++,
                e - this.lastTimeCheck > 1e3 && (this.lastTimeCheck = e,
                this.fps = this.frames,
                this.fps,
                this.frames = 0)
            }
        };
        const y = {
            data: null,
            start(e, t, n, r, i) {
                this.data = {
                    val: e,
                    init: e,
                    target: t,
                    rateLog: Math.log(n),
                    setFn: r,
                    endCb: i
                }
            },
            update(e) {
                const t = this.data;
                if (!t)
                    return;
                t.val = i(t.val, t.target, o(e, t.rateLog));
                let n = Math.abs(t.val - t.target) < .01 * Math.abs(t.init - t.target);
                n && (t.val = t.target,
                this.data = null),
                t.setFn(t.val),
                n && t.endCb && t.endCb()
            }
        };
        var P, S;
        !function(e) {
            e[e.PLAYING = 0] = "PLAYING",
            e[e.JUST_FINISHED = 1] = "JUST_FINISHED",
            e[e.FINISHED = 2] = "FINISHED"
        }(P || (P = {})),
        function(e) {
            e[e.NONE = 0] = "NONE",
            e[e.HIT_PATH = 1] = "HIT_PATH",
            e[e.HIT_OBST = 2] = "HIT_OBST"
        }(S || (S = {}));
        class A {
            constructor(n) {
                this.gl = n,
                this.mouseMovement = [0, 0],
                this.dampedMovement = [0, 0],
                this.rotation = [0, 0],
                this.position = [0, 0, 0],
                this.energy = 1,
                this.energyState = S.NONE,
                this.blackoutFactor = 1,
                this.invincibleTime = 0,
                this.setBlackout = e=>this.blackoutFactor = e,
                this.finishState = P.PLAYING,
                this.isDead = !1,
                this.floatingParticles = new _(n),
                this.pathParticles = new b(n,l.pathColor),
                this.pathParticles.figure = 0,
                this.obstacleParticles = new b(n,l.obstacleColor),
                this.position[2] = 5,
                y.start(-1, 1, .05, this.setBlackout),
                this.audioProc = function() {
                    let n = new AudioContext;
                    const i = (()=>{
                        let i = function(n, i, o, a, s) {
                            var c = n.createGain();
                            c.channelCountMode = "explicit",
                            c.channelCount = 2;
                            var l = n.createGain()
                              , u = n.createChannelMerger(2)
                              , m = n.createChannelSplitter(2)
                              , f = n.createBiquadFilter();
                            f.type = "highpass",
                            f.frequency.value = 200;
                            var p = n.createGain()
                              , d = n.createGain();
                            p.gain.value = .4,
                            d.gain.value = .7,
                            c.connect(d),
                            c.connect(p),
                            p.connect(m),
                            u.connect(f),
                            f.connect(l),
                            d.connect(l);
                            for (var h = [], v = [], g = [], x = 0; x < t.length; x++) {
                                var T = n.createBiquadFilter();
                                T.type = "allpass",
                                T.frequency.value = t[x],
                                v.push(T),
                                v[x - 1] && v[x - 1].connect(T)
                            }
                            for (var _ = 0; _ < t.length; _++) {
                                var b = n.createBiquadFilter();
                                b.type = "allpass",
                                b.frequency.value = t[_],
                                g.push(b),
                                g[_ - 1] && g[_ - 1].connect(b)
                            }
                            v[v.length - 1].connect(u, 0, 0),
                            g[g.length - 1].connect(u, 0, 1);
                            for (var E = 0; E < e.length; E++) {
                                var y = r(n);
                                y.delayTime.value = e[E],
                                E < e.length / 2 ? (m.connect(y, 0),
                                y.connect(v[0])) : (m.connect(y, 1),
                                y.connect(g[0])),
                                h.push(y)
                            }
                            return function() {
                                for (var e = 0; e < h.length; e++)
                                    h[e].resonance.value = .8,
                                    h[e].dampening.value = 6e3
                            }(),
                            c.connect = l.connect.bind(l),
                            c.disconnect = l.disconnect.bind(l),
                            c
                        }(n);
                        i.connect(n.destination);
                        let o = n.createDelay(1);
                        o.delayTime.value = 60 / 90 / 1.5;
                        let a = n.createGain();
                        a.gain.value = .3;
                        let s = n.createGain();
                        return s.gain.value = 0,
                        s.connect(o),
                        o.connect(a),
                        a.connect(o),
                        o.connect(i),
                        s
                    }
                    )();
                    let o = n.createOscillator();
                    o.frequency.value = 0,
                    o.type = "triangle",
                    o.start();
                    let s = n.createGain();
                    o.connect(s),
                    s.connect(i);
                    const c = [0, 0, 0, 0].map((e=>{
                        let t = n.createOscillator();
                        t.frequency.value = .3 + .3 * Math.random(),
                        t.type = "sine",
                        t.start();
                        let r = n.createGain();
                        r.gain.value = 10,
                        t.connect(r);
                        let o = n.createOscillator();
                        o.frequency.value = 0,
                        o.type = "sine",
                        o.start(),
                        r.connect(o.detune);
                        let a = n.createGain();
                        return o.connect(a),
                        a.connect(i),
                        o
                    }
                    ));
                    let l = n.createScriptProcessor(null, 0, 1);
                    l.onaudioprocess = e=>{
                        let t = e.outputBuffer
                          , n = t.getChannelData(0);
                        for (let e = 0; e < t.length; e++)
                            n[e] = 2 * Math.random() - 1
                    }
                    ;
                    let u = n.createBiquadFilter();
                    u.type = "bandpass",
                    u.frequency.value = 2e3,
                    u.Q.value = 14;
                    let m = n.createOscillator();
                    m.frequency.value = .4,
                    m.type = "sine",
                    m.start();
                    let f = n.createGain();
                    f.gain.value = 200;
                    let p = n.createGain();
                    m.connect(f),
                    f.connect(u.detune),
                    u.frequency,
                    l.connect(u),
                    u.connect(p),
                    p.connect(i);
                    const d = (e=>{
                        const t = 60 * n.sampleRate / 360
                          , r = [[0, 3, 7, 10, 7, 15, 12], [0, 3, 7, 12, 3, 15, 10], [3, 12, 10, 7, 3, 12, 17], [7, 9, 10, 12, 7, 12, 19], [0, 3, 7, 10, 7, 15, 12], [0, 3, 7, 12, 3, 15, 10], [3, 5, 12, 15, 3, 17, 15], [7, 10, 15, 17, 10, 15, 19]];
                        let i = 0
                          , o = 0
                          , s = 0
                          , c = -1;
                        const l = e=>220 * Math.pow(2, e / 12)
                          , u = n.createScriptProcessor(null, 0, 6);
                        u.onaudioprocess = e=>{
                            let u = e.outputBuffer
                              , m = u.getChannelData(0)
                              , f = u.getChannelData(1)
                              , p = [2, 3, 4, 5].map((e=>u.getChannelData(e)));
                            for (let e = 0; e < u.length; e++) {
                                i++,
                                i >= t * r[o].length * 4 && (i = 0,
                                o = (o + 1) % r.length);
                                let u = i % t / t
                                  , d = [.1, .9]
                                  , h = a(0, d[0], u) * (1 - a(d[0], d[1], u));
                                m[e] = h;
                                const v = Math.floor(i / t) % r[o].length;
                                f[e] = l(r[o][v]),
                                s -= 1,
                                s < 0 && (-1 == c && (c = Math.floor(3 * Math.random())),
                                s < -.3 * n.sampleRate && (c = -1,
                                s = (1 + 3 * Math.random()) * n.sampleRate)),
                                p.forEach(((t,n)=>{
                                    t[e] = l(r[o][n + 1] - 12 + (c == n ? 24 : 0))
                                }
                                ))
                            }
                        }
                        ;
                        const m = n.createChannelSplitter(6);
                        return u.connect(m),
                        m
                    }
                    )();
                    return d.connect(s.gain, 0),
                    d.connect(o.frequency, 1),
                    d.connect(c[0].frequency, 2),
                    d.connect(c[1].frequency, 3),
                    d.connect(c[2].frequency, 4),
                    d.connect(c[3].frequency, 5),
                    i.gain.linearRampToValueAtTime(.05, n.currentTime + 3),
                    {
                        noise: e=>{
                            p.gain.value = e
                        }
                    }
                }(),
                this.invincibleTime = l.invincibleTime
            }
            resize(e) {
                this.projection = c.perspective(l.camParams[0], e[0] / e[1], l.camParams[1], l.camParams[2])
            }
            getProgress() {
                return -this.position[2] / l.finalDist
            }
            updateAndRender(e, t) {
                if (this.finishState == P.JUST_FINISHED && (this.finishState = P.FINISHED),
                this.finishState != P.PLAYING)
                    return;
                const n = Math.max(1, Math.floor(1 + 8 * this.getProgress()));
                var r, u, m;
                this.obstacleParticles.figure != n && (this.obstacleParticles.figure = n,
                this.invincibleTime = l.invincibleTime),
                this.invincibleTime -= e.dt,
                this.invincibleTime,
                this.dampedMovement = (r = this.dampedMovement,
                u = this.mouseMovement,
                m = o(e.dt, l.movementDampingLog),
                r.map(((e,t)=>i(e, u[t], m)))),
                this.mouseMovement = [0, 0];
                const f = this.dampedMovement;
                this.rotation = this.rotation.map(((e,t)=>{
                    let n = f[t] > 0 != e > 0 ? 1 : 1 - a(Math.PI / 6, Math.PI / 4, Math.abs(e));
                    return e + f[t] * l.movementPower * n
                }
                ));
                const p = c.id().mul(c.rotation(this.rotation[0], 0, 2)).mul(c.rotation(this.rotation[1], 1, 2))
                  , d = [p.at(2, 0), p.at(2, 1), p.at(2, 2)]
                  , h = Math.sqrt(Math.max(this.energy, 0)) * l.maxSpeed;
                this.position = ((e,t)=>e.map(((e,n)=>e + t[n])))(this.position, s(d, -h * e.dt)),
                this.position.map((e=>e.toFixed(2))),
                -this.position[2] > l.finalDist - l.camParams[2] - 2 && null == this.finalParticles && (this.finalParticles = new b(this.gl,l.finalColor),
                this.finalParticles.figure = 20);
                const v = c.translate(s(this.position, -1))
                  , g = p.mul(v)
                  , x = {
                    proj: this.projection,
                    view: g,
                    invProjView: this.projection.mul(g).invert()
                };
                let T, _ = [this.floatingParticles, this.pathParticles, this.obstacleParticles], E = !1;
                this.finalParticles && (_.push(this.finalParticles),
                E = this.finalParticles.hitTest(e, this.position) < l.hitFinalDistance),
                _.forEach((n=>n.updateAndRender(e, x, t[1])));
                const A = this.obstacleParticles.hitTest(e, this.position)
                  , R = this.pathParticles.hitTest(e, this.position);
                this.audioProc.noise(Math.min(1, Math.exp(2 * -R))),
                T = A < l.hitObstDistance && this.invincibleTime <= 0 ? S.HIT_OBST : R < l.hitPathDistance ? S.HIT_PATH : S.NONE,
                this.energyState = T,
                this.energy += (T == S.HIT_PATH ? l.energySpeedHitPath : T == S.HIT_OBST ? l.energySpeedHitObst : l.energySpeedNone) * e.dt,
                this.energy = Math.min(this.energy, 1),
                this.energy <= 0 && !this.isDead && this.finishState == P.PLAYING && (this.isDead = !0,
                y.start(1, 0, .1, this.setBlackout, (()=>{
                    this.rotation = [0, 0],
                    this.position = [0, 0, this.position[2] + l.deathPosDrop],
                    this.energy = 1,
                    this.isDead = !1,
                    this.invincibleTime = l.invincibleTime,
                    y.start(-1, 1, .1, this.setBlackout)
                }
                ))),
                E && this.finishState == P.PLAYING && y.start(1, 0, .1, this.setBlackout, (()=>this.finishState = P.JUST_FINISHED)),
                this.energy
            }
            onMouseMove(e, t) {
                this.mouseMovement = [e, -t]
            }
        }
        class R {
            constructor() {
                const e = document.getElementById("canvasgl")
                  , t = document.getElementById("canvas2d")
                  , n = e.getContext("webgl2")
                  , r = t.getContext("2d");
                if (!n)
                    return void console.log("Unable to initialize WebGL");
                if (!r)
                    return void console.log("Unable to initialize 2d context");
                T.init(n),
                this.gameState = new A(n);
                const i = this.initRenderHelper(n, this.getSize());
                this.ctx = {
                    canvasGL: e,
                    canvas2d: t,
                    gl: n,
                    context2d: r,
                    time: 0,
                    dt: .016,
                    lastDate: Date.now(),
                    input: new g(t,((e,t)=>{
                        this.gameState.onMouseMove(e, t)
                    }
                    ),(e=>{
                        let t = ["1", "2", "3", "4"].indexOf(e);
                        if (t < 0)
                            return;
                        let n = [1, 2, 4, 8][t];
                        i.renderTargets.particlesTarget.div = n,
                        i.renderTargets.bufferTarget.div = n,
                        i.resize()
                    }
                    )),
                    renderHelper: i
                },
                window.addEventListener("resize", (()=>this.handleResize())),
                this.handleResize(),
                this.loop()
            }
            initRenderHelper(e, t) {
                return new v(e,{
                    particlesTarget: new d(1,e.LINEAR_MIPMAP_LINEAR),
                    bufferTarget: new h(1),
                    outputTarget: new p
                },{
                    pass1: new f(e,"simple.vert.glsl","pass1.frag.glsl"),
                    screen: new f(e,"simple.vert.glsl","screen.frag.glsl")
                },t)
            }
            render() {
                const e = this.ctx.gl
                  , t = this.ctx.renderHelper;
                {
                    const n = t.bindOutput(t.renderTargets.particlesTarget);
                    e.clearColor(0, 0, 0, 1),
                    e.clear(e.COLOR_BUFFER_BIT),
                    this.gameState.updateAndRender(this.ctx, n)
                }
                !function(e, t) {
                    e.activeTexture(e.TEXTURE0),
                    e.bindTexture(e.TEXTURE_2D, t),
                    e.generateMipmap(e.TEXTURE_2D),
                    e.bindTexture(e.TEXTURE_2D, null)
                }(e, t.renderTargets.particlesTarget.getReadTex());
                {
                    const {program: n, size: r} = t.renderPassBegin([t.renderTargets.particlesTarget, t.renderTargets.bufferTarget], t.renderTargets.bufferTarget, t.programs.pass1);
                    e.uniform1i(n.uniformLoc("newTex"), 0),
                    e.uniform1i(n.uniformLoc("prevTex"), 1),
                    e.uniform1f(n.uniformLoc("t"), this.ctx.time),
                    e.uniform1f(n.uniformLoc("dt"), this.ctx.dt),
                    e.uniform2f(n.uniformLoc("res"), r[0], r[1]),
                    t.renderPassCommit()
                }
                {
                    const {program: n, size: r} = t.renderPassBegin([t.renderTargets.bufferTarget], t.renderTargets.outputTarget, t.programs.screen);
                    e.uniform1i(n.uniformLoc("tex"), 0),
                    e.uniform2f(n.uniformLoc("res"), r[0], r[1]),
                    e.uniform1f(n.uniformLoc("energy"), this.gameState.energy),
                    e.uniform1i(n.uniformLoc("energyState"), this.gameState.energyState),
                    e.uniform1f(n.uniformLoc("progress"), this.gameState.getProgress()),
                    e.uniform1f(n.uniformLoc("blackout"), this.gameState.blackoutFactor),
                    t.renderPassCommit()
                }
            }
            formatTime(e) {
                const t = 1e3 * e % 1e3
                  , n = Math.floor(e) % 60
                  , r = e=>e < 10 ? `0 ${e}` : e;
                return `${r(Math.floor(e / 60))}:${r(n)}:${(e=>{
                    const t = e.toFixed(0);
                    return e < 10 ? `00 ${t}` : e < 100 ? `0 ${t}` : t
                }
                )(t)}`
            }
            loop() {
                const e = this.ctx;
                let t = Date.now()
                  , n = (t - e.lastDate) / 1e3;
                if (e.time += n,
                e.lastDate = t,
                E.update(t),
                e.dt = i(e.dt, n, .1),
                y.update(n),
                this.gameState.finishState == P.JUST_FINISHED) {
                    const t = e.context2d;
                    t.fillStyle = "#000",
                    t.fillRect(0, 0, t.canvas.width, t.canvas.height),
                    t.font = "bold 20px monospace",
                    t.fillStyle = "#ffffff",
                    t.shadowColor = "#ffffffbb",
                    t.shadowBlur = 20;
                    let n = 0;
                    const r = e=>{
                        t.fillText(e, 40, 100 + 30 * n),
                        n++
                    }
                    ;
                    r("Congratulations!"),
                    r(`Your time is ${this.formatTime(e.time)}`),
                    n++,
                    r("Kosminenvirtaus"),
                    r("a game by kostik1337"),
                    r("Thanks for playing!")
                }
                this.render(),
                window.requestAnimationFrame((()=>this.loop()))
            }
            getSize() {
                return [window.innerWidth, window.innerHeight]
            }
            handleResize() {
                const e = this.getSize();
                [this.ctx.canvasGL, this.ctx.canvas2d].forEach((t=>{
                    t.width = e[0],
                    t.height = e[1]
                }
                )),
                this.ctx.renderHelper.resize(e),
                this.gameState.resize(e)
            }
        }
        let F = document.getElementById("canvas2d");
        F.onclick = ()=>{
            F.onclick = null,
            new R
        }
    }
    )()
}
)();
