<template>
    <div class="activity-wrapper" v-loading="loading">
        <h1>Activity</h1>
        <div v-for="(singleActivity,index) in activityData" :key="index">

            <div class="activity-inside-row-wrapper">
                <el-row>
                    <el-col :xs="3" :sm="3" :md="2" :lg="2" :xl="2">
                        <div class="purchase-wrapper"
                             :class="{boughtClass : singleActivity.purchase === 'bought' , soldClass : singleActivity.purchase === 'sold'}">
                          <span>
                              {{singleActivity.purchase}}
                          </span>
                        </div>
                    </el-col>
                    <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1">
                        <img class="dataset-icon" src="~@/assets/id-ic-dataset.svg" alt="">
                    </el-col>
                    <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                        <el-tooltip effect="light" :content="singleActivity.data_set.name" placement="top">
                            <p class="dataset-filename">
                                {{singleActivity.data_set.name}}
                            </p>
                        </el-tooltip>
                    </el-col>
                    <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">
                        <p class="form-to-user">
                            {{singleActivity.purchase | fromToUserFilter}}
                        </p>
                    </el-col>
                    <el-col :xs="2" :sm="2" :md="1" :lg="1" :xl="1">
                        <div class="jazzicon-wrapper">
                            <jazzicon
                                    :address="singleActivity.address"
                                    :colors="jazziconColors"
                                    :diameter="24"
                            ></jazzicon>
                        </div>
                    </el-col>
                    <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                        <el-tooltip effect="light" :content="singleActivity.address" placement="top">
                            <p class="dataset-filename">
                                {{singleActivity.address}}
                            </p>
                        </el-tooltip>
                    </el-col>
                    <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1">
                        <p class="form-to-user">
                            for
                        </p>
                    </el-col>
                    <el-col :xs="3" :sm="3" :md="4" :lg="4" :xl="4">
                        <div v-if="!singleActivity.price">
                            <el-button
                                    round
                                    size="mini"
                                    @click="getDatasetPrice(singleActivity,index)">
                                REQUEST PRICE
                            </el-button>
                        </div>
                        <div v-else-if="singleActivity.price =='fetching'">
                            <i class="el-icon-loading"></i>
                        </div>
                        <div v-else>
                            <el-tooltip effect="light" :content="integerToString(singleActivity.price)" placement="top">
                                <p class="dataset-trac-price">
                                    {{singleActivity.price}} TRAC
                                </p>
                            </el-tooltip>
                        </div>
                    </el-col>
                    <el-col :xs="3" :sm="3" :md="4" :lg="4" :xl="4">
                            <p class="dataset-transaction-date-time">
                                {{singleActivity.timestamp | fromTimestampToHumanReadable}}
                            </p>
                    </el-col>
                </el-row>
            </div>

        </div>


    </div>
</template>

<script>

    export default {
        name: 'Activity',
        data() {
            return {
                loading: false,
                activityData: [],
                node_address: '',
                jazziconColors: [
                    '#01888C', // teal
                    '#FC7500', // bright orange
                    '#034F5D', // dark teal
                    '#F73F01', // orangered
                    '#FC1960', // magenta
                    '#C7144C', // raspberry
                    '#F3C100', // goldenrod
                    '#1598F2', // lightning blue
                    '#2465E1', // sail blue
                    '#F19E02' // gold
                ]
            }
        },
        created() {
            this.loading = true;

            this.node_address = localStorage.getItem('node_address');
            console.log('nesto');
            this.fetchPurchasedData();
            this.fetchSoldData();
            this.sortActivitesByDate();
            this.loading = false;
//WAITING FOR UPDATE ON NODE API RESPONSE TO GET NODE SELLER ID
            // this.getDatasetPrice();

        },
        mounted() {

        },
        methods: {
            fromTimestampToHumanReadableMethod(value) {
                let date = new Date(value);

                let day = date.getDate();
                let month = date.getMonth() + 1;
                let year = date.getFullYear();
                let hour = date.getHours();
                let minute = date.getMinutes();
                let seconds = date.getSeconds();

                return `${day}.${month}.${year} at ${hour}:${minute}`
            },
            integerToString(int) {
                return typeof int === 'number' ? int.toString() : int;
            },
            fetchPurchasedData() {
                console.log('entered')
                axios({
                    method: 'get',
                    url: `https://${window.node_address}:8900/api/latest/private_data/trading_info/PURCHASED`
                }).then(response => {
                    if (response.data) {
                        console.log(response.data,'purchased')
                        response.data.forEach((row, index) => {
                            row.purchase = 'bought';
                            this.activityData.push(row);
                            row.address = row.seller_erc_id;
                        })

                    } else {
                        this.$notify({
                            message: 'Something went wrong with loading of data, check connection with node!',
                            type: 'warning'
                        });
                    }

                });
            },
            fetchSoldData() {
                axios({
                    method: 'get',
                    url: `https://${window.node_address}:8900/api/latest/private_data/trading_info/SOLD`
                }).then(response => {
                    console.log(response.data,'sold')
                    if (response.data) {

                        response.data.forEach((row, index) => {

                            row.purchase = 'sold';
                            this.activityData.push(row);
                            row.address = row.buyer_erc_id
                        })

                    } else {
                        this.$notify({
                            message: 'Something went wrong with loading of data, check connection with node!',
                            type: 'warning'
                        });
                    }

                });
            },
            checkPriceHandler(handler_id, dataset_index) {
                axios({
                    method: 'get',
                    url: `https://${window.node_address}:8900/api/latest/network/private_data/get_price/result/${handler_id}`,
                }).then(response => {

                    if (response.data && response.data.status === 'PENDING') {

                        setTimeout(() => {
                            this.checkPriceHandler(handler_id, dataset_index);
                        }, 2000);


                    } else if (response.data.status === 'COMPLETED') {

                        this.$notify({
                            title: 'Loading price status',
                            message: 'Price successfully loaded!',
                            type: 'success'
                        });
                        this.updateDatasetRow(dataset_index, response.data.data.message.price_in_trac);

                    } else {

                        this.$notify({
                            title: 'Loading status',
                            message: 'Something went wrong with updating price!',
                            type: 'warning'
                        });
                    }

                });
            },
            getDatasetPrice(dataset, dataset_index) {
                this.activityData[dataset_index].price = 'fetching';
                this.$forceUpdate();
                let requestBody = {};
                requestBody.ot_object_id = dataset.ot_json_object_id;
                requestBody.seller_node_id = dataset.seller_node_id;
                requestBody.data_set_id = dataset.data_set.id;
                axios({
                    method: 'post',
                    url: `https://${window.node_address}:8900/api/latest/network/private_data/get_price`,
                    data: requestBody,
                    header: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                    },
                }).then(response => {
                    if (response.data) {
                        this.checkPriceHandler(response.data.handler_id, dataset_index);
                    } else {

                        this.$notify({
                            title: 'Loading status',
                            message: 'Something went wrong with updating price!',
                            type: 'warning'
                        });
                    }

                }).catch((error) => {
                    console.log(error.response);
                })
            },
            sortActivitesByDate() {
                this.activityData.sort((a, b) => b.timestamp - a.timestamp)
            },
            updateDatasetRow(dataset_index, price) {
                    this.activityData[dataset_index].price = price / 1000000000000000000;
                    this.activityData[dataset_index].showPrice = true;
                    this.$forceUpdate();
            }
        },
        filters: {
            fromToUserFilter(val) {
                return val === 'bought' ? 'from user' : 'to user';
            },
            fromTimestampToHumanReadable(timestamp) {
                let date = new Date(timestamp);

                let day = date.getDate();
                let month = (date.getMonth() + 1).toString();
                let year = date.getFullYear().toString();
                let hour = date.getHours().toString();
                let minute = date.getMinutes().toString();
                let seconds = date.getSeconds();
                switch (1) {
                    case minute.length:
                        minute = `0${minute}`
                        break;
                    case hour.length:
                        hour = `0${hour}`
                        break;
                }
                return `${day}.${month}.${year} at ${hour}:${minute}`
            }
        }
    }
</script>

<style lang="scss">
    @import "../scss/_activity.scss";
</style>
