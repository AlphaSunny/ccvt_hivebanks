App={
    web3Provider: null,
    contracts: {},
    account: '0x0',
    loading: false,
    tokenPrice: 1000000000000000,
    tokensSold: 0,
    beneficiary: '',
    tokensAvailable: 750000,
    openingTime: '',
    ccvtLockInstance: '',
    ccvtInstance:'',


    init: function() {
        console.log("App initialized")
        return App.initWeb3();
    },

    initWeb3: function() {
        if (typeof web3 !== 'undefined') {
            // If a web3 instance is already provided by Meta Mask.
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
          } else {
            alert("请使用chrome,并安装metamask");
            // // Specify default instance if no web3 instance provided
            // App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            // web3 = new Web3(App.web3Provider);
            // console.log("listen the port")
          }
          return App.initContracts();
    },

    initContracts: function() {
        $.getJSON("./js/CommunicationCreatesValueTokenLock.json", function(communicationCreatesValueTokenLock) {
            App.contracts.CommunicationCreatesValueTokenLock = TruffleContract(communicationCreatesValueTokenLock);
            App.contracts.CommunicationCreatesValueTokenLock.setProvider(App.web3Provider);
            App.contracts.CommunicationCreatesValueTokenLock.deployed().then(function(communicationCreatesValueTokenLock) {
                console.log("CommunicationCreatesValueTokenLock address:", communicationCreatesValueTokenLock.address);
            });
        }).done(function() {
            $.getJSON("./js/CommunicationCreatesValueToken.json", function(communicationCreatesValueToken){
                App.contracts.CommunicationCreatesValueToken = TruffleContract(communicationCreatesValueToken);
                App.contracts.CommunicationCreatesValueToken.setProvider(App.web3Provider);
                App.contracts.CommunicationCreatesValueToken.deployed().then(function(communicationCreatesValueToken) {
                    console.log("CommunicationCreatesValueToken Address:", communicationCreatesValueToken.address);
                })
            }).done( function () {
                return App.render();
                }

            )
            //App.listenForEvents();
        });
    },

    listenForEvents: function() {
        App.contracts.CommunicationCreatesValueTokenLock.deployed().then(function(instance) {
            instance.Sell({}, {
                fromBlock: 0,
                toBlock: 'latest',
            }).watch(function(error, event) {
                console.log("event triggered", event);
                App.render();
            })
        })
    },

    render: function() {
        if( App.loading) {
            return;
        }
        App.loading = true;

        var loader = $('#loader');
        var content = $('#content');


        loader.show();
        content.hide();

        web3.eth.getCoinbase(function(err, account) {
            if(err == null) {
                App.account = account;
                // $('#accountAddress').html("Your account: " + account );
                $('#accountAddress').val(account);

            }
        })

        App.contracts.CommunicationCreatesValueTokenLock.deployed().then(function(instance) {
            App.ccvtLockInstance = instance;
            return App.ccvtLockInstance.beneficiary();
        }).then(function(beneficiary) {
            App.beneficiary = beneficiary;
            $('#beneficiary').val(beneficiary);
            return App.ccvtLockInstance.openingTime();
        }).then(function(openingTime) {
            App.openingTime = openingTime;
            $('#releaseTime').val(openingTime);
            $('#time').val(timestampToTime(openingTime));

            $('.tokens-sold').html(App.tokensSold);
            $('.tokens-available').html(App.tokensAvailable);

            var progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
            $('#progress').css('width', progressPercent + '%');

            // Load token contract
            App.contracts.CommunicationCreatesValueToken.deployed().then(function(instance) {
                App.ccvtInstance = instance;
                return App.ccvtInstance.balanceOf(App.account);
            }).then(function(balance) {
                $('#ccvt-balance').val(balance.toNumber());
                App.loading = false;
                loader.hide();
                content.show();
            })
        })
    },




    unfreeze: function() {
        App.contracts.CommunicationCreatesValueTokenLock.deployed().then(function(instance) {
            return instance.release({
                from: App.account,
                gas: 500000
            });
        }).then(function(result) {
            console.log(result);
            console.log("Tokens release...")
            $('form').trigger('reset')
        });
    }


}

function timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return Y+M+D+h+m+s;
    }

$(function() {
    $(window).load(function() {
        App.init();
    })
});
