$(function () {
    let url_path = window.location.hostname;
    let ok_url = window.location.search.split("=")[1];
    let url = "https://" + url_path + "/api/crontab/get_scale_us_data.php";
    // let url = "test.json";
    let letter_arr = [],text_timer = "";
    let item_list = [], item_list_arr = [], level_list = [];

    //判断是否在规定时间内
    function Start() {
        if (ok_url == "ok") {
            console.log("有OK ，过期了");
            $(".loading,.upload_text").remove();
            AJAX_Start("guo");
        } else {
            timeIsOk();
        }
    }

    Start();

    //判断当前时间
    function timeIsOk() {
        let curr_time = new Date();
        let end_time = new Date("2019/3/22 18:15");//setTime
        let num = parseInt((end_time - curr_time) / 1000);

        console.log(num);

        if (num > 0) {
            console.log("没有OK。没有过期");
            setTimeout(function () {
                $(".upload_text").text("升级成功");
                $(".loading,.upload_text").remove();
                AJAX_Start("no_guo");
            }, 3000);
        } else {
            console.log("没有OK。过期了");
            $(".loading,.upload_text").remove();
            AJAX_Start("guo");
        }
    }

    //开始执行
    let max = "";

    function AJAX_Start(type) {
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            success: function (res) {
                let data = res.all_list;
                item_list = res;
                if(data == ""){
                    alert("暂无数据");
                    return;
                }

                $.each(data, function (i, val) {
                    letter_arr.push(data[i].wechat);
                });

                if (type != "guo") {
                    particleAlphabetFun(max);
                } else {
                    $("#text,.show_name").remove();
                    upItemFun();
                }
            }
        });
    }

    function upItemFun() {
        $.each(item_list, function (i, val) {
            if (i.indexOf("list_") > -1) {
                item_list_arr.push(item_list[i]);
                level_list.push(i);
            }
        });
        for (let i = 0; i < item_list_arr.length; i++) {
            let div = $("<div class='up_item'><h2><svg class='icon'><use xlink:href='#icon-lv"+ level_list[i].split("list_")[1] +"'></use></svg><span>" + level_list[i].split("list_")[1] + "</span>级用户</h2><ul class='item_ul'></ul></div>");
            let li = "";
            for (let j = 0; j < item_list_arr[i].length; j++) {
                li += "<li class='wow slideInRight' data-wow-delay='800ms'>" +
                    "<svg class='icon'><use xlink:href='#icon-lv"+ level_list[i].split("list_")[1] +"'></use></svg>" +
                    "<span title=" + item_list_arr[i][j].wechat + ">" + item_list_arr[i][j].wechat + "</span>" +
                    "</li>";
            }
            div.find(".item_ul").html(li);
            $(".up_content").append(div);
            textRandom();
        }
    }

    function Prepend(val) {
        setTimeout(function () {
            $(".show_name_ul").prepend("<li class='wow bounceInRight'>" + val + "</li>");
        }, 1000);
    }

    //文字特效
    function particleAlphabetFun() {
        let particleAlphabet = {
            Particle: function (x, y) {
                this.x = x;
                this.y = y;
                this.radius = 4;//粒子大小
                this.draw = function (ctx) {
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.fillStyle = 'white';
                    // ctx.fillStyle = 'red';
                    ctx.fillRect(0, 0, this.radius, this.radius);
                    ctx.restore();
                };
            },
            init: function () {
                particleAlphabet.canvas = document.getElementById('text');
                // particleAlphabet.canvas = document.querySelector('canvas');
                particleAlphabet.ctx = particleAlphabet.canvas.getContext('2d');
                particleAlphabet.W = window.innerWidth;
                particleAlphabet.H = window.innerHeight;
                particleAlphabet.particlePositions = [];
                particleAlphabet.particles = [];
                particleAlphabet.tmpCanvas = document.createElement('canvas');
                particleAlphabet.tmpCtx = particleAlphabet.tmpCanvas.getContext('2d');

                particleAlphabet.canvas.width = particleAlphabet.W;
                particleAlphabet.canvas.height = particleAlphabet.H;

                text_timer = setInterval(function () {
                    particleAlphabet.changeLetter();
                    particleAlphabet.getPixels(particleAlphabet.tmpCanvas, particleAlphabet.tmpCtx);
                }, 1500);//变换时间

                particleAlphabet.makeParticles(6000);//文字粒子多少
                particleAlphabet.animate();
            },
            currentPos: 0,
            changeLetter: function () {
                // let letters = 'ABCDEFGHIJKLMNOPQRSTUVXYZ',
                // letters = letters.split('');
                let letters = letter_arr;//显示的数据
                particleAlphabet.time = letters;
                particleAlphabet.time = letters[particleAlphabet.currentPos];
                particleAlphabet.currentPos++;
                if (particleAlphabet.currentPos >= letters.length) {
                    // particleAlphabet.currentPos = 0;
                    clearInterval(text_timer);
                    setTimeout(function () {
                        $("#text,.show_name").remove();
                        upItemFun();
                    }, 1000);

                }
                Prepend(particleAlphabet.time);
            },
            makeParticles: function (num) {
                for (let i = 0; i <= num; i++) {
                    particleAlphabet.particles.push(new particleAlphabet.Particle(particleAlphabet.W / 2 + Math.random() * 400 - 200, particleAlphabet.H / 2 + Math.random() * 400 - 200));
                }
            },
            getPixels: function (canvas, ctx) {
                let keyword = particleAlphabet.time,
                    gridX = 6,
                    gridY = 6;
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                ctx.fillStyle = 'red';
                ctx.font = 'italic bold 120px Noto Serif';
                ctx.fillText(keyword, canvas.width / 2 - ctx.measureText(keyword).width / 2, canvas.height / 2);
                let idata = ctx.getImageData(0, 0, canvas.width, canvas.height);
                let buffer32 = new Uint32Array(idata.data.buffer);
                if (particleAlphabet.particlePositions.length > 0) particleAlphabet.particlePositions = [];
                for (let y = 0; y < canvas.height; y += gridY) {
                    for (let x = 0; x < canvas.width; x += gridX) {
                        if (buffer32[y * canvas.width + x]) {
                            particleAlphabet.particlePositions.push({x: x, y: y});
                        }
                    }
                }
            },
            animateParticles: function () {
                let p, pPos;
                for (let i = 0, num = particleAlphabet.particles.length; i < num; i++) {
                    p = particleAlphabet.particles[i];
                    pPos = particleAlphabet.particlePositions[i];
                    if (particleAlphabet.particles.indexOf(p) === particleAlphabet.particlePositions.indexOf(pPos)) {
                        p.x += (pPos.x - p.x) * .3;
                        p.y += (pPos.y - p.y) * .3;
                        p.draw(particleAlphabet.ctx);
                    }
                }
            },
            animate: function () {
                requestAnimationFrame(particleAlphabet.animate);
                particleAlphabet.ctx.fillStyle = 'rgba(0, 0, 0, .8)';
                // particleAlphabet.ctx.fillStyle = 'rgba(233, 41, 158, .8)';
                particleAlphabet.ctx.fillRect(0, 0, particleAlphabet.W, particleAlphabet.H);
                particleAlphabet.animateParticles();
            }
        };
        new particleAlphabet.init;
        // particleAlphabet.init;//本地测试用
    }

    //文字随机效果
    function textRandom() {
        let li_list = $(".up_content").find("li");
        setInterval(function () {
            let num = sum(1, 200);
            li_list.eq(num).css({"transform": "scale(1.5)", "transition": "all 1s"});
            setTimeout(function () {
                li_list.eq(num).css({"transform": "unset", "transition": "all 1s"});
            }, 1000);
        }, 1000);
    }

    function sum(m, n) {
        return Math.floor(Math.random() * (m - n) + n);
    }
});