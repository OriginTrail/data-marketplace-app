<template>
    <div id="app">
        <div class="container-fluid navigation-wrapper container-fluid-custom">
            <nav class="navbar navbar-expand-lg navbar-light mb-1">

                <img class="logo" @click="indexTracker(0)" alt="OriginTrail" src="./assets/dataMarketplaceLogo.png">

                <button class="navbar-toggler" :class="{hider:!submittedBool}" type="button" data-toggle="collapse"
                        data-target="#navbarNavDropdown"
                        aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" :class="{hider:!submittedBool}" id="navbarNavDropdown">

                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item dropdown">
                            <a class="nav-link  dropdown-toggle"
                               :class="{disabled:!submittedBool,blueEr:activeIndex2==6}" href="#"
                               id="navbarDropdownMenuLink" role="button"
                               data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Data Marketplaces
                            </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                <a class="dropdown-item fdm" @click="indexTracker(6)" href="#">Food Data Marketplace</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item marketplaces" href="#">Satelite Data Marketplace <span
                                        class="comingSoon">COMING SOON</span></a>
                                <a class="dropdown-item marketplaces" href="#">Sensor Data Marketplace<span
                                        class="comingSoon">COMING SOON</span></a>
                                <a class="dropdown-item marketplaces " href="#">Laboratory Data Marketplace<span
                                        class="comingSoon">COMING SOON</span></a>


                            </div>
                        </li>
                        <!--                        <li class="nav-item" @click="indexTracker(11)">-->
                        <!--                            <a class="nav-link" :class="{disabled:!submittedBool,blueEr:activeIndex2==11}" href="#">Getting-->
                        <!--                                Started</a>-->
                        <!--                        </li>-->
                        <li class="nav-item" @click="indexTracker(7)">
                            <a class="nav-link" :class="{disabled:!submittedBool,blueEr:activeIndex2==7}" href="#">My
                                purchases</a>
                        </li>
                        <li class="nav-item" @click="indexTracker(8)">
                            <a class="nav-link" :class="{disabled:!submittedBool,blueEr:activeIndex2==8}" href="#">Put
                                dataset on sale</a>
                        </li>
                        <li class="nav-item" @click="indexTracker(9)">
                            <a class="nav-link" :class="{disabled:!submittedBool,blueEr:activeIndex2==9}" href="#">Activity</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link  dropdown-toggle"
                               :class="{disabled:!submittedBool,blueEr:activeIndex2==1||activeIndex2==2||activeIndex2==3||activeIndex2==4||activeIndex2==5||activeIndex2==10}"
                               href="#"
                               id="navbarDropdownMenuLink" role="button"
                               data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                System Configuration
                            </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                <a class="dropdown-item" :class='{blueEr:activeIndex2==1}' @click="indexTracker(1)"
                                   href="#">My Account</a>
                                <a class="dropdown-item" :class='{blueEr:activeIndex2==2}' @click="indexTracker(2)"
                                   href="#">Node Profile</a>
                                <a class="dropdown-item" :class='{blueEr:activeIndex2==3}' @click="indexTracker(3)"
                                   href="#">Node Configuration</a>
                                <a class="dropdown-item" :class='{blueEr:activeIndex2==4}' @click="indexTracker(4)"
                                   href="#">Pricing Configuration</a>
                                <a class="dropdown-item" :class='{blueEr:activeIndex2==5}' @click="indexTracker(5)"
                                   href="#">Jobs/Offers</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" :class='{blueEr:activeIndex2==10}' @click="indexTracker(10)"
                                   href="#">Help</a>
                            </div>
                        </li>

                    </ul>
                    <ul class="navbar-nav ml-auto">
                        <li>
                            <div class="balance-wrapper-widget">
                                <p>Current Balance</p>
                                <p class="balance" v-if="this.balance === 0">
                                    <i class="el-icon-loading"></i>
                                </p>

                                <p class="balance" v-else>{{ this.balance.toFixed(3) }} TRAC</p>
                            </div>
                        </li>
                        <li class="nav-item" @click="logout">
                            <a class="nav-link margin-left-12" :class="{disabled:!submittedBool}" href="#">Logout</a>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>


        <div id="main-container" class="container">
            <div v-if='!submitted'>
                <el-main>
                    <div class="landing-page-form-wrapper">
                        <h1 class="text-center form-headline">Data Marketplace</h1>
                        <div class="landing-page-inner-wrapper">
                            <el-form>
                                <div class="network-wrapper text-left">
                                    <span class="label">Choose Network</span>
                                    <el-select class="" v-model="selected_network"
                                               placeholder="Please select the network">
                                        <el-option
                                                v-for="item in network_options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>


                                <el-form-item label="ODN Node Address"
                                >
                                    <el-input
                                            spellcheck="false"
                                            :disabled="selected_network === ''"
                                            type="textarea"
                                            :autosize="{ minRows: 1, maxRows: 2}"
                                            resize="none"
                                            v-model="node_address"></el-input>
                                </el-form-item>
                                <el-form-item label="ERC-725 Identity"
                                >
                                    <el-input
                                            spellcheck="false"
                                            :disabled="selected_network === ''"
                                            type="textarea"
                                            :autosize="{ minRows: 1, maxRows: 2}"
                                            resize="none"
                                            v-model="erc_identity"></el-input>
                                </el-form-item>
                                <el-form-item label="Houston password"
                                >
                                    <el-input
                                            spellcheck="false"
                                            :disabled="selected_network === ''"
                                            type="textarea"
                                            :autosize="{ minRows: 1, maxRows: 2}"
                                            resize="none"
                                            v-model="houston_pass"></el-input>
                                </el-form-item>
                                <el-form-item label="Operational Wallet Address"
                                >
                                    <el-input
                                            spellcheck="false"
                                            :disabled="selected_network === ''"
                                            type="textarea"
                                            :autosize="{ minRows: 1, maxRows: 2}"
                                            resize="none"
                                            v-model="operational_wallet"></el-input>
                                </el-form-item>
                                <el-form-item
                                        spellcheck="false"
                                        v-if="mobileTrue"
                                        label="Please enter your management wallet address"
                                >
                                    <el-input
                                            :disabled="selected_network === ''"
                                            maxlength="42"
                                            minlength="42"
                                            type="textarea"
                                            :autosize="{ minRows: 1, maxRows: 2}"
                                            resize="none"
                                            v-model="management_wallet_input"></el-input>
                                </el-form-item>

                                <el-button class="landing-page-button" @click="showTermsMethod"
                                           :disabled="selected_network === ''">SUBMIT
                                </el-button>
                                <terms-and-conditions-dialog
                                        v-if="showTermsAndConditions"></terms-and-conditions-dialog>
                            </el-form>
                        </div>
                    </div>
                </el-main>
            </div>
            <div v-else-if="activeIndex2 == '1'">
                <my-account :profile-storage-address="profile_storage_address"
                            :profile-address="profile_address"
                            :erc725="erc_identity"
                            :submitted="submitted"
                            :operational-wallet="operational_wallet"
                            :token-address="token_contract"
                            :node-id="node_id"
                            :configData="configData"
                            :systemData="systemData"
                            :management_wallet_input="management_wallet_input"></my-account>
            </div>

            <div v-else-if="activeIndex2 == '2'" class="token-management-wrapper">
                <el-row>
                    <ManagementHeader></ManagementHeader>
                </el-row>
                <div>
                    <el-container>
                        <el-aside class="asideClass" width="30%" v-if="!mobileTrue">
                            <balances
                                    :profile-storage-address="profile_storage_address"
                                    :profile-address="profile_address"
                                    :erc725="erc_identity"
                                    :operational-wallet="operational_wallet"
                                    :token-address="token_contract"
                                    :management_wallet_input="management_wallet_input"
                            ></balances>
                        </el-aside>
                        <div v-if="mobileTrue">
                            <balances
                                    :profile-storage-address="profile_storage_address"
                                    :profile-address="profile_address"
                                    :erc725="erc_identity"
                                    :operational-wallet="operational_wallet"
                                    :token-address="token_contract"
                                    :management_wallet_input="management_wallet_input"
                            ></balances>
                        </div>
                        <el-main v-loading="loading"
                                 :element-loading-text="loading_text">
                            <el-row>
                                <el-col :span="12">
                                    <deposit-eth :operational-wallet="operational_wallet"></deposit-eth>
                                </el-col>
                                <el-col :span="12">
                                    <deposit-tokens
                                            :profile-address="profile_address"
                                            :token-address="token_contract"
                                            :erc725="erc_identity">
                                    </deposit-tokens>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <withdraw
                                            :erc725="erc_identity"
                                            :profile-address="profile_address"
                                    ></withdraw>
                                </el-col>
                                <el-col :span="12">
                                    <manage-wallets
                                            :erc725="erc_identity"></manage-wallets>
                                </el-col>
                            </el-row>
                        </el-main>
                    </el-container>

                </div>
            </div>

            <div v-else-if="activeIndex2 == '3'">
                <node-config :node-config="configData" :system="systemData" :node-id="node_id"
                             v-if="showConfig"></node-config>
            </div>
            <div v-else-if="activeIndex2 == '4'">
                <node-pricing :node-config="configData" :system="systemData" :node-id="node_id"
                              v-if="showConfig"></node-pricing>
            </div>
            <div v-else-if="activeIndex2 == '5'">
                <jobs :submitted="submitted"></jobs>
            </div>

            <div v-else-if="mobileTrue">
                <el-main>
                    <balances
                            v-if="showNodeProfile"
                            :profile-storage-address="profile_storage_address"
                            :profile-address="profile_address"
                            :erc725="erc_identity"
                            :operational-wallet="operational_wallet"
                            :token-address="token_contract"
                            :management_wallet_input="management_wallet_input"
                    ></balances>
                </el-main>
            </div>
            <div v-else-if="activeIndex2 == '6'">
                <explore-marketplace></explore-marketplace>
            </div>
            <div v-else-if="activeIndex2 == '7'">
                <my-purchases></my-purchases>
            </div>
            <div v-else-if="activeIndex2 == '8'">
                <Datasets-on-sale :submitted="submitted"></Datasets-on-sale>
            </div>
            <div v-else-if="activeIndex2 == '9'">
                <activity></activity>
            </div>
            <div v-else-if="activeIndex2 == '10'">Component Help</div>
            <div v-else-if="activeIndex2 == '11'">
                <getting-started></getting-started>
            </div>
            <el-container v-else>
                <home @navigation="indexTracker"
                      @once="onceFunction"
                      :submited="onceSumbitted"

                ></home>
            </el-container>
            <Footer></Footer>
        </div>
    </div>
</template>

<script>
    import Balances from './components/Balances.vue';
    import DepositEth from './components/DepositEth.vue';
    import DepositTokens from './components/DepositTokens.vue';
    import Withdraw from './components/Withdraw.vue';
    import ManageWallets from './components/ManageWallets.vue';
    import MyAccount from './components/MyAccount.vue';
    import NodePricing from './components/NodePricing.vue';
    import Jobs from './components/Jobs.vue';
    import NodeConfig from './components/NodeConfig.vue';
    import ManagementHeader from './components/TokenManagementHeader.vue';
    import Utilities from './Utilities';
    import DatasetsOnSale from './components/DatasetsOnSale';
    import MyPurchases from "./components/MyPurchases";
    import Home from "./components/Home"
    import Footer from "./components/Footer"
    import ExploreMarketplace from "./components/ExploreMarketplaceComponent";
    import MarketplaceCard from "./components/MarketplaceCardComponent";
    import TermsAndConditionsDialog from "./components/TermsAndConditionsDialog";
    import GettingStarted from "./components/GettingStarted"
    import Activity from "./components/Activity";

    /* eslint-disable */
    export default {
        name: 'app',
        data() {
            return {
                onceSumbitted: false,
                node_address: '',
                clickFalse: null,
                firstLogin: false,
                activeIndex2: 0,
                token_contract: '',
                profile_address: '',
                profile_storage_address: '',
                submitted: 0,
                submittedBool: false,
                loading_text: 'Transaction in progress. Please wait for transaction to finish.',
                loading: false,
                mobileTrue: false,
                management_wallet_input: '',
                erc_identity: '',
                operational_wallet: '',
                houston_pass: '',
                rules: {
                    operational_wallet: [
                        {
                            required: true,
                            message: 'Please input your operational wallet',
                            trigger: 'blur',
                        },
                        {
                            max: 42,
                            message: 'Your wallet should not be more than 42 characters',
                        },
                        {
                            min: 42,
                            message: 'Your wallet should be at least 42 characters long',
                        },
                    ],
                    erc_identity: [
                        {
                            required: true,
                            message: 'Please input your ERC-Identity',
                            trigger: 'blur',
                        },
                        {
                            max: 42,
                            message: 'Your ERC-Identity should not be more than 42 characters',
                        },
                        {
                            min: 42,
                            message: 'Your ERC-Identity should be at least 42 characters long',
                        },
                    ],
                },
                showTermsAndConditions: false,
                showNodeProfile: false,
                showMyAccount: false,
                showNodeConfig: false,
                showNodePricing: false,
                showJobs: false,
                configData: {},
                systemData: {},
                showConfig: false,
                node_id: '',
                network_options: [{
                    value: 'mainnet',
                    label: 'Mainnet',
                }, {
                    value: 'testnet',
                    label: 'Testnet',
                },
                    {
                        value: 'testnet-marketplace',
                        label: 'Testnet Marketplace',
                    }],
                selected_network: 'testnet',
                balance: 0,
                locked_trac: 0,
                total_trac: 0
            };
        },
        mounted() {
            this.calculateAppHeight();

            EventBus.$on('calculate-app-height', () => {
                this.calculateAppHeight();
            });

            if (localStorage.getItem('node_address') !== null) {
                this.node_address = localStorage.getItem('node_address');
            }

            if (localStorage.getItem('erc_identity') !== null) {
                this.erc_identity = localStorage.getItem('erc_identity');
            }

            if (localStorage.getItem('houston_pass') !== null) {
                this.houston_pass = localStorage.getItem('houston_pass');
            }

            if (localStorage.getItem('operational_wallet') !== null) {
                this.operational_wallet = localStorage.getItem('operational_wallet');
            }

            if (localStorage.getItem('selected_network') !== null) {
                this.selected_network = localStorage.getItem('selected_network');
            }

            window.EventBus.$on('loading', (msg) => {
                this.loading = true;
                this.loading_text = msg || 'Transaction in progress. Please wait for transaction to finish.';
            });

            window.EventBus.$on('loading-done', () => {
                this.loading = false;
            });

            EventBus.$on('terms-checked', () => {
                this.showTermsAndConditions = false;
                this.submitIdentity();
            });

            EventBus.$on('close-terms', () => {
                this.showTermsAndConditions = false;
            });

            EventBus.$on('load-my-purchases', () => {
                this.activeIndex2 = 7;
            });

            if (window.screen.width <= 770) {
                this.mobileTrue = true;
            }
        },
        methods: {
            onceFunction() {
                this.onceSumbitted = true;
            },
            showTermsMethod() {
                this.showTermsAndConditions = true;
            },
            submitIdentity() {
                localStorage.setItem('erc_identity', this.erc_identity);
                localStorage.setItem('operational_wallet', this.operational_wallet);
                localStorage.setItem('houston_pass', this.houston_pass);
                localStorage.setItem('node_address', this.node_address);
                localStorage.setItem('selected_network', this.selected_network);


                if (this.selected_network === 'mainnet') {
                    Utilities.connectToMainnet();

                    window.hub.tokenAddress()
                        .then((result) => {
                            this.token_contract = result[0];
                        });

                    window.hub.getContractAddress('Profile')
                        .then((result) => {
                            this.profile_address = result[0];
                        });

                    window.hub.getContractAddress('ProfileStorage')
                        .then((result) => {
                            this.profile_storage_address = result[0];
                        });

                    window.node_address = this.node_address;

                } else if (this.selected_network === 'testnet-marketplace') {

                    Utilities.connectToTestnetMarketplace();

                    window.hub.tokenAddress()
                        .then((result) => {
                            this.token_contract = result[0];
                        });

                    window.hub.getContractAddress('Profile')
                        .then((result) => {
                            this.profile_address = result[0];
                        });

                    window.hub.getContractAddress('ProfileStorage')
                        .then((result) => {
                            this.profile_storage_address = result[0];
                        });

                    window.node_address = this.node_address;


                } else {
                    Utilities.connectToTestnet();

                    window.hub.tokenAddress()
                        .then((result) => {
                            this.token_contract = result[0];
                        });

                    window.hub.getContractAddress('Profile')
                        .then((result) => {
                            this.profile_address = result[0];
                        });

                    window.hub.getContractAddress('ProfileStorage')
                        .then((result) => {
                            this.profile_storage_address = result[0];
                        });

                    window.node_address = this.node_address;
                }

                this.submitted = 1;
                this.submittedBool = true;
                this.activeIndex2 = '0';

                this.$socket.io.uri = `https://${window.node_address}:3000/?password=${this.houston_pass}`;
                this.$socket.open();

                this.nodeApiInfo();

                setTimeout(() => {
                    if (!this.$socket.connected) {
                        this.$notify({
                            message: 'Connection with the node could not be established, please double check provided credentials!',
                            type: 'warning',
                            duration: 4000
                        });
                    } else {
                        this.checkBalance();
                    }
                }, 3000);


                window.EventBus.$emit('get-balances-event');


            },
            checkBalance() {

                const profileStorageContract = window.eth.contract(window.profileStorageAbi)
                    .at(this.profile_storage_address);

                profileStorageContract.getStakeReserved(this.erc_identity).then((result) => {

                    let locked_trac = new window.Eth.BN(result[0]).toString() / 1000000000000000000;
                    this.locked_trac = parseFloat(locked_trac.toFixed(3));

                    profileStorageContract.getStake(this.erc_identity).then((result, locked_trac) => {

                        let total_trac = new window.Eth.BN(result[0]).toString() / 1000000000000000000;
                        this.total_trac = parseFloat(total_trac.toFixed(3));


                        this.balance = this.total_trac - this.locked_trac;
                    });
                });


            },
            toTrac(val) {
                const am = new window.Eth.BN(val);
                const base = new window.Eth.BN(10);
                const exponent = new window.Eth.BN(15);
                const multiply = base.pow(exponent);
                return (am.div(multiply).toNumber() < 0) ? 0 : am.div(multiply).toNumber() / 1000;
            },
            indexTracker(key) {
                console.log(key);
                this.calculateAppHeight();
                this.activeIndex2 = key;
            },
            calculateAppHeight() {
                $('.footerComponent').css({
                    "visibility": "visible",
                });

                setTimeout(() => {

                    console.log('calucalted');

                    let main_container_height = $('#main-container').height();
                    let token_management_wrapper = $('.token-management-wrapper').height();

                    console.log(main_container_height, window.innerHeight);

                    if (window.innerHeight > main_container_height + 100) {
                        $('#app').css("height", "100vh");
                        $('.footerComponent').css({
                            "position": "absolute",
                            "bottom": "30px"
                        });
                        $('.footerComponent').css({
                            "visibility": "visible",
                        });

                        if (this.activeIndex2 === 6) {
                            $('#app').css("height", "100%");
                            $('.footerComponent').css({
                                "position": "relative",
                            });

                            $('.footerComponent').css({
                                "visibility": "visible",
                            });
                        }

                    } else if (window.innerHeight < main_container_height) {


                        $('#app').css("height", "100%");
                        $('.footerComponent').css({
                            "position": "relative",
                        });

                        $('.footerComponent').css({
                            "visibility": "visible",
                        });
                    }
                }, 100);
            },
            nodeApiInfo() {
                let object = {};
                object.ot_object_id = 'urn:ot:object:actor:id:Nesium';
                object.seller_node_id = '0x443d771aAfaa3D6Fb66c4a81D97778200a6882D5';
                object.data_set_id = '0xc97ac04d04b1126e2335ad85e7363555df81ab786ce7ff250bce0acfdb852d21';

                let next_object = {};
                next_object.query = [
                    {
                        "path": "id",
                        "value": "urn:ot:object:actor:id:Nesium",
                        "opcode": "EQ"
                    }
                ];
            },
            logout() {
                this.submitted = 0;
                this.submittedBool = false;
                this.activeIndex2 = '0';
                $.ajax({
                    url: "",
                    context: document.body,
                    success: function (s, x) {

                        $('html[manifest=saveappoffline.appcache]').attr('content', '');
                        $(this).html(s);
                    }
                });
                this.calculateAppHeight();
            }
        },
        sockets: {
            connect() {
                console.log('Socket connected. Checking for version!');
                this.$socket.emit('get-balance');
                this.$socket.emit('get-balance');
                this.$socket.emit('get-node-info');
            },
            config(val) {

                console.log(val, 'config');
                this.node_id = val.identity;
                this.configData = val;
                this.showConfig = true;
                window.EventBus.$emit('config', val);
                window.EventBus.$emit('node_id', this.node_id);

            },
            system(val) {
                this.systemData = val;
                window.network_type_constant = val.info.environment;
                window.EventBus.$emit('system-data', val);

            },
            balance(val) {

            },
            nodeInfo(val) {

            },
            purchaseStatus(val) {

                console.log(val, 'val');

                this.$notify.info({
                    title: val.title,
                    message: val.description
                });
            }

        },
        components: {
            Activity,
            GettingStarted,
            MarketplaceCard,
            ExploreMarketplace,
            Footer,
            Home,
            Jobs,
            NodePricing,
            NodeConfig,
            Balances,
            DepositEth,
            DepositTokens,
            Withdraw,
            ManageWallets,
            MyAccount,
            ManagementHeader,
            DatasetsOnSale,
            MyPurchases,
            TermsAndConditionsDialog
        },
    };
</script>

<style lang="scss">
    @import "./scss/marketplace-card";
    @import "./scss/explore-marketplace";
    @import "./scss/landig-page";
    @import "./scss/navigation";
    @import "scss/general";
    @import "scss/datasets_on_sale";
    @import "scss/dialogs";
    @import "scss/termsDialog";


    .container {
        max-width: 1450px !important;
    }

    #app {
        font-family: 'Roboto', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    .el-menu--horizontal > .el-menu-item.is-active {
        border-bottom: 2px solid #1d2667;
        color: #2a9fd8;
        background-color: #f6f6f6;
    }

    .el-menu-item.is-active {
        border-bottom: 1px solid #2a9fd8;
        color: #2a9fd8;
        background-color: #f6f6f6;
    }

    .falser {
        border-bottom: 2px solid #f6f6f6;
    }

    .el-menu-item:hover {
        background-color: #f6f6f6 !important;
    }

    .el-menu-item {

        //height: 14px;
        opacity: 0.6;
        font-family: Roboto;
        font-size: 14px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        //line-height: 1;
        letter-spacing: normal;
        color: #131415;

    }

    .el-form-item {
        margin-bottom: 15px;
        margin-top: 25px;
    }

    .deposit-trac .houston-btn {
        position: absolute;
        bottom: 28px;
    }

    .el-menu--horizontal .el-menu-item:not(.is-disabled):focus, .el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
        outline: 0;
        color: #2a9fd8;
    }


    .el-aside {
        text-align: left;
    }

    .panel {
        background-color: #ffffff;
        margin: 10px;
        padding: 10px 20px;
        border-radius: 4px;
        border: solid 1px var(--grey_200A);
        text-align: left;
        border: 1px solid #dfdfdf;
        min-height: 486px;

        .el-icon-info {
            font-size: 17px;
            top: -4px;
            left: 6px;
            position: relative;
        }
    }

    .panel-form {
        width: 400px;
        margin: 100px auto;
    }

    .el-message-box {
        font-family: 'Roboto', Helvetica, Arial, sans-serif;
    }

    .el-popover {
        font-family: 'Roboto', Helvetica, Arial, sans-serif;
    }

    .el-message__content {
        font-family: 'Roboto', Helvetica, Arial, sans-serif;
    }

    .el-main {
        height: 100%;
    }
    .el-input-number__decrease, .el-input-number__increase{
        background: none;
    }


    .token-management-wrapper {
        width: 100%;
        padding: 40px 0;
    }

    .el-dropdown-link {
        cursor: pointer;
        color: #303133;
    }

    .el-icon-arrow-down {
        font-size: 12px;
    }

    .el-row {
        margin-bottom: 20px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .asideClass {
        margin-top: 35px;
    }

    .el-col {
        border-radius: 4px;
    }
</style>
