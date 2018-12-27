$(function () {
    // var url = "test.json";
    // var url_path = window.location.hostname;
    // var url = "https://" + url_path + "/api/crontab/get_scale_us_data.php";
    var url = "https://ccvt_test.fnying.com/api/crontab/get_scale_us_data.php";
    var letter_arr = [], one_list = [], two_list = [], type_one = "1", type_two = "2";
    var text_timer = "";
    $.ajax({
        type: "GET",
        url: url,
        dataType: "jsonp",
        success: function (res) {
            var data = res.all_list;
            one_list = res.one_list;
            two_list = res.two_list;
            $.each(data, function (i, val) {
                letter_arr.push(data[i].wechat);
            });
            particleAlphabetFun();
        }
    });

    var level_one_ul_box = "", level_two_ul_box = "";
    var item = 19, one_ul_item = "", two_ul_item = "";

    //一级列表
    function level_one() {
        var length = one_list.length;
        one_ul_item = Math.floor(length / item);
        CreateOneUl(one_ul_item);
    }

    //2级列表
    function level_two() {
        var length = two_list.length;
        console.log(length);
        two_ul_item = Math.floor(length / item);
        console.log(two_ul_item);
        CreateTwoUl(two_ul_item);
    }

    //生成一级对应数量的ul
    function CreateOneUl(length) {
        for (var i = 0; i < length; i++) {
            level_one_ul_box += "<ul></ul>";
        }
        $(".level_one_ul_box").html(level_one_ul_box);
        ListOne();
    }

    //生成2级对应数量的ul
    function CreateTwoUl(length) {
        for (var i = 0; i < length; i++) {
            level_two_ul_box += "<ul></ul>";
        }
        $(".level_two_ul_box").html(level_two_ul_box);
        ListTwo();
    }

    //生成列表
    function ListOne() {
        $.each(one_list, function (j, val) {
            if (j < item) {
                $(".level_one_ul_box ul:nth-child(1)").append("<li class=''>" + one_list[j].wechat + "<svg class='icon'><use xlink:href='#icon-lv1'></use></svg></li>");
                // $(".level_two_ul_box ul:nth-child(1)").append("<li class=''>" + j + letter_arr[j] + "<svg class='icon'><use xlink:href='#icon-lv2'></use></svg></li>");
            } else if (j >= item && j < item * 2) {
                $(".level_one_ul_box ul:nth-child(2)").append("<li class=''>" + one_list[j].wechat + "<svg class='icon'><use xlink:href='#icon-lv1'></use></svg></li>");
                // $(".level_two_ul_box ul:nth-child(2)").append("<li class=''>" + j + letter_arr[j] + "<svg class='icon'><use xlink:href='#icon-lv2'></use></svg></li>");
            } else {
                $(".level_one_ul_box ul:nth-child(3)").append("<li class=''>" + one_list[j].wechat + "<svg class='icon'><use xlink:href='#icon-lv1'></use></svg></li>");
                // $(".level_two_ul_box ul:nth-child(3)").append("<li class=''>" + j + letter_arr[j] + "<svg class='icon'><use xlink:href='#icon-lv2'></use></svg></li>");
            }
        });
        level_two();
    }

    //生成列表
    function ListTwo() {
        $.each(two_list, function (j, val) {
            if (j < item) {
                // $(".level_one_ul_box ul:nth-child(1)").append("<li class=''>" + j + letter_arr[j] + "<svg class='icon'><use xlink:href='#icon-lv1'></use></svg></li>");
                $(".level_two_ul_box ul:nth-child(1)").append("<li class=''>" + j + two_list[j].wechat + "<svg class='icon'><use xlink:href='#icon-lv2'></use></svg></li>");
            } else if (j >= item && j < item * 2) {
                // $(".level_one_ul_box ul:nth-child(2)").append("<li class=''>" + j + letter_arr[j] + "<svg class='icon'><use xlink:href='#icon-lv1'></use></svg></li>");
                $(".level_two_ul_box ul:nth-child(2)").append("<li class=''>" + j + two_list[j].wechat + "<svg class='icon'><use xlink:href='#icon-lv2'></use></svg></li>");
            } else {
                // $(".level_one_ul_box ul:nth-child(3)").append("<li class=''>" + j + letter_arr[j] + "<svg class='icon'><use xlink:href='#icon-lv1'></use></svg></li>");
                $(".level_two_ul_box ul:nth-child(3)").append("<li class=''>" + j + two_list[j].wechat + "<svg class='icon'><use xlink:href='#icon-lv2'></use></svg></li>");
            }
        })
    }


    function Prepend(val) {
        setTimeout(function () {
            $(".show_name_ul").prepend("<li class='wow bounceInRight'>" + val + "</li>");
        }, 100);
    }

    //文字特效
    function particleAlphabetFun() {
        var particleAlphabet = {
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
                }, 100);//变换时间

                particleAlphabet.makeParticles(6000);//文字粒子多少
                particleAlphabet.animate();
            },
            currentPos: 0,
            changeLetter: function () {
                // var letters = 'ABCDEFGHIJKLMNOPQRSTUVXYZ',
                // letters = letters.split('');
                var letters = letter_arr;//显示的数据
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
                for (var i = 0; i <= num; i++) {
                    particleAlphabet.particles.push(new particleAlphabet.Particle(particleAlphabet.W / 2 + Math.random() * 400 - 200, particleAlphabet.H / 2 + Math.random() * 400 - 200));
                }
            },
            getPixels: function (canvas, ctx) {
                var keyword = particleAlphabet.time,
                    gridX = 6,
                    gridY = 6;
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                ctx.fillStyle = 'red';
                ctx.font = 'italic bold 120px Noto Serif';
                ctx.fillText(keyword, canvas.width / 2 - ctx.measureText(keyword).width / 2, canvas.height / 2);
                var idata = ctx.getImageData(0, 0, canvas.width, canvas.height);
                var buffer32 = new Uint32Array(idata.data.buffer);
                if (particleAlphabet.particlePositions.length > 0) particleAlphabet.particlePositions = [];
                for (var y = 0; y < canvas.height; y += gridY) {
                    for (var x = 0; x < canvas.width; x += gridX) {
                        if (buffer32[y * canvas.width + x]) {
                            particleAlphabet.particlePositions.push({x: x, y: y});
                        }
                    }
                }
            },
            animateParticles: function () {
                var p, pPos;
                for (var i = 0, num = particleAlphabet.particles.length; i < num; i++) {
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
        // window.onload = particleAlphabet.init;
        particleAlphabet.init;
    }
});