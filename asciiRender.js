let A = 0, B = 0;

let rotX = 0.0;
let rotZ = 0.03;
let radius_1 = 4;
let radius_2 = 1;
let scale = 60;
let width = 100;
let height = 50;

let cameraX, cameraY, cameraZ = 10;


function setOuterParams(){
    radius_1    = Number( document.getElementById("radius_1").innerHTML );
    radius_2     = Number( document.getElementById("radius_2").innerHTML );
    scale           = Number( document.getElementById("scale").innerHTML );
    rotX            = Number( document.getElementById("rotX").innerHTML / 100 );
    rotZ            = Number( document.getElementById("rotZ").innerHTML / 100 );
    cameraZ         = Number( document.getElementById("cameraDist").innerHTML );
}

function ascii_frame2() {



    //region [ making canvas ]
    let b = [];
    let z = [];

    for (let k = 0; k < width * height; k++) {
        let x = k % width;
        if (x === width - 1) {
            b[k] = "<br>";
        } else {
            b[k] = "\u00A0";
        }
        z[k] = 0;
    }
    //endregion


    for (let j = 0; j < Math.PI  * 2; j += 0.04) {



        let ct =  Math.cos(j), st =  Math.sin(j);
        let ox = radius_2 * ct + radius_1,
            oy = radius_2 * st;
        
        for (let i = 0; i < Math.PI * 2; i += 0.02) {
            let sp = Math.sin(i), cp = Math.cos(i);

/**         Donut Matrix ( pitch )
 *
 *          cp   0   sp
 *          0    1   0
 *         -sp   0   cp
 */

            //model
            let mx = ox * cp,
                my = oy,
                mz = -ox * sp;


/**                 Rotation Matrix
 *             roll                 yaw
 *
 *          1   0   0           cB  -sB   0
 *          0   cA  -sA         sB   cB   0
 *          0   sA  cA          0    0    1
 *
 *
 *          calculated
 *
 *          cB              -sB              0
 *          cA * sB         cA * cB         -sA
 *          sA * sB        sA * cB         cA
 *
 */
            let cA = Math.cos(A ), sA = Math.sin( A ),
                cB = Math.cos(-B), sB = Math.sin(-B);

            let wx = cB * mx - sB * my,
            wy = cA * sB * mx + cA * cB * my - sA * mz ,
            wz = sA * sB * mx + sA * cB * my + cA * mz;





            let D = 1/(wz + cameraZ),
                x = Math.floor( width / 2 + scale * D * wx ),
                y = Math.floor( height / 2 + scale / 2 * D * wy);


            //calculate Light
            let lmx = ct * cp,
                lmy = st,
                lmz = -ct * sp;

            let lx = cB * lmx - sB * lmy;
            let ly = cA * sB * lmx + cA * cB * lmy - sA * lmz ;
            let lz = sA * sB * lmx + sA * cB * lmy + cA * lmz;

            let lightDir = [ 0, -1 ,-1 ];

            let N = Math.floor(8 * (lightDir[0] * lx +  lightDir[1] * ly  + lightDir[2] * lz));




            let o = x + width * y;
            if ( y < height && y >= 0 && x >= 0 && x < width-1
                && D > z[o] ) {
                z[o] = D;
                b[o] = ".,-~:;=!*#$@"[N > 0 ? N : 0];
            }
        }
    }
    return b.join("");
}

function ascii_frame(){

    let b = [];
    let z = [];
    let cA = Math.cos(A), sA = Math.sin(A),
        cB = Math.cos(B), sB = Math.sin(B);


    //region [ making canvas ]
    for (let k = 0; k < width * height; k++) {
        let x = k % width;
        if (x === width - 1) {
            b[k] = "<br>";
        } else {
            b[k] = "\u00A0";
        }
        z[k] = 0;
    }
    //endregion




    //1차 원 ( 도넛의 단면 )
    for (let j = 0; j < Math.PI  * 2; j += 0.04) {
        let ct =  Math.cos(j), st =  Math.sin(j);
        let ox = radius_2 * ct + radius_1, // R1 + R2*cos(theta)
            oy = radius_2 * st;

        //2차로 위에서 만든 원을 회전시켜 도넛 구성
        for (let i = 0; i < Math.PI * 2; i += 0.02) {
            let sp = Math.sin(i), cp = Math.cos(i);




            let D, x, y;
            // //미스테리 구역... 왜이렇게 계산이 간단함?
            D = 1 / (ox * sp * sA + oy * cA + cameraZ); // this is 1/z
            let t = sp * ox * cA - oy * sA;
            x = Math.floor(width / 2 + scale * D *       (cp * ox * cB - t * sB));
            y = Math.floor(height / 2 + scale / 2 * D *  (cp * ox * sB + t * cB));


            let o = x + width * y,
            N = Math.floor(8 * ((st * sA - sp * ct * cA) * cB - sp * ct * sA - st * cA - cp * ct * sB));
            if ( y < height && y >= 0 && x >= 0 && x < width-1
                && D > z[o] ) {
                z[o] = D;
                b[o] = ".,-~:;=!*#$@"[N > 0 ? N : 0];
            }
        }
    }
    return b.join("");
}

function ascii_render() {
    setOuterParams();
    A += rotX;
    B += rotZ;

    document.getElementById('canvas2').innerHTML = ascii_frame2();
}

window.addEventListener("load", () => {
    setInterval(ascii_render, 50);
}, false);

