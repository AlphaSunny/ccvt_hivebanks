$(function () {
    let url_path = window.location.hostname;
    let ok_url = window.location.search.split("=")[1];
    // let url = "https://" + url_path + "/api/crontab/get_scale_us_data.php";
    let url = "test.json";
    let letter_arr = [], one_list = [], two_list = [],three_list = [];
    let text_timer = "", item_one = "", item_two = "", ul_num = 3;

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
        let end_time = new Date("2019-1-23 15:37");
        let num = parseInt((end_time - curr_time) / 1000);

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
    function AJAX_Start(type) {
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            success: function (res) {
                console.log(res);
                console.log(res[0].all_list);
                let data = res[0].all_list;
                one_list = res[0].one_list;
                two_list = res[0].two_list;
                three_list = res[0].three_list;
                item_one = Math.ceil(one_list.length / ul_num);
                item_two = Math.ceil(two_list.length / ul_num);
                $(".one_level_num").text(one_list.length);
                $(".two_level_num").text(two_list.length);
                $(".three_level_num").text(three_list.length);
                $.each(data, function (i, val) {
                    letter_arr.push(data[i].wechat);
                });
                if (type != "guo") {
                    particleAlphabetFun();
                } else {
                    $("body,html").addClass('bg_black');
                    $("#text,.show_name").remove();
                    $(".already_up_box").css("display", "flex");
                    level_one();
                }
            }
        });
    }


    let level_one_ul_box = "", level_two_ul_box = "", level_three_ul_box = "";

    //一级列表
    function level_one() {
        for (let i = 0; i < ul_num; i++) {
            level_one_ul_box += "<ul></ul>";
        }
        $(".level_one_ul_box").html(level_one_ul_box);
        ListOne();
    }

    //2级列表
    function level_two() {
        for (let i = 0; i < ul_num; i++) {
            level_two_ul_box += "<ul></ul>";
        }
        $(".level_two_ul_box").html(level_two_ul_box);
        ListTwo();
    }

    //3级列表
    function level_three() {
        for (let i = 0; i < ul_num; i++) {
            level_three_ul_box += "<ul></ul>";
        }
        $(".level_three_ul_box").html(level_three_ul_box);
        ListThree();
    }

    //生成列表
    function ListOne() {
        $.each(one_list, function (j, val) {
            if (j < item_one) {
                $(".level_one_ul_box ul:nth-child(1)").append("<li class='wow slideInRight' data-wow-delay='800ms'><svg class='icon'><use xlink:href='#icon-lv1'></use></svg>" + one_list[j].wechat + "</li>");
            } else if (j >= item_one && j < item_one * 2) {
                $(".level_one_ul_box ul:nth-child(2)").append("<li class='wow slideInRight' data-wow-delay='800ms'><svg class='icon'><use xlink:href='#icon-lv1'></use></svg>" + one_list[j].wechat + "</li>");
            } else {
                $(".level_one_ul_box ul:nth-child(3)").append("<li class='wow slideInRight' data-wow-delay='800ms'><svg class='icon'><use xlink:href='#icon-lv1'></use></svg>" + one_list[j].wechat + "</li>");
            }
        });
        level_two();
    }

    //生成列表
    function ListTwo() {
        $.each(two_list, function (j, val) {
            if (j < item_two) {
                $(".level_two_ul_box ul:nth-child(1)").append("<li class='wow slideInLeft' data-wow-delay='800ms'><svg class='icon'><use xlink:href='#icon-lv2'></use></svg>" + two_list[j].wechat + "</li>");
            } else if (j >= item_two && j < item_two * 2) {
                $(".level_two_ul_box ul:nth-child(2)").append("<li class='wow slideInLeft' data-wow-delay='800ms'><svg class='icon'><use xlink:href='#icon-lv2'></use></svg>" + two_list[j].wechat + "</li>");
            } else {
                $(".level_two_ul_box ul:nth-child(3)").append("<li class='wow slideInLeft' data-wow-delay='800ms'><svg class='icon'><use xlink:href='#icon-lv2'></use></svg>" + two_list[j].wechat + "</li>");
            }
        });
        level_three();
    }

    //生成列表
    function ListThree() {
        $.each(two_list, function (j, val) {
            if (j < item_two) {
                $(".level_three_ul_box ul:nth-child(1)").append("<li class='wow slideInLeft' data-wow-delay='800ms'><svg class='icon'><use xlink:href='#icon-lv3'></use></svg>" + two_list[j].wechat + "</li>");
            } else if (j >= item_two && j < item_two * 2) {
                $(".level_three_ul_box ul:nth-child(2)").append("<li class='wow slideInLeft' data-wow-delay='800ms'><svg class='icon'><use xlink:href='#icon-lv3'></use></svg>" + two_list[j].wechat + "</li>");
            } else {
                $(".level_three_ul_box ul:nth-child(3)").append("<li class='wow slideInLeft' data-wow-delay='800ms'><svg class='icon'><use xlink:href='#icon-lv3'></use></svg>" + two_list[j].wechat + "</li>");
            }
        });
        textRandom();
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
                }, 1000);//变换时间

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
                        $("body,html").addClass('bg_black');
                        $("#text,.show_name").remove();
                        $(".already_up_box").css("display", "flex");
                        level_one();
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
        let li_list = $(".already_up_box").find("li");
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