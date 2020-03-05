<template>
    <div class="my-purchases-wrapper">
        <h1>My Purchases</h1>
        <div class="purchases-content-wrapper">
            <div class="table-wrapper">
                <data-tables
                        :data="datasetsData"
                        :pagination-props="paginationProps"
                        :lazy="false"
                        ref="purchaseDataTable"
                        :table-props="purchaseDataTableProps">
                    <el-table-column
                            header-align="left"
                            label="Name of Dataset"
                            sortable
                            :show-overflow-tooltip="true"
                            prop="filename">
                        <template slot-scope="scope">
                            <img class="dataset-icon" src="~@/assets/id-ic-dataset.svg" alt="">
                                <span class="black-text">
                                    {{ (scope.row.data_set.name === '') ? 'Name not provided' : scope.row.data_set.name }}
                                    <br>
                                    <span class="time">{{scope.row.timestamp | fromTimestampToHumanReadable}}</span>
                                </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="Bought from"
                            sortable
                            :show-overflow-tooltip="true"
                            width="180px"
                            prop="seller_erc_id">
                        <template slot-scope="scope">
                            <div class="inline-div">
                                <jazzicon :address="scope.row.seller_erc_id" :diameter="20" class="jazzicon-custom"></jazzicon>
                                <span class="issuer-identity">
                                    {{trimText3(scope.row.seller_erc_id)}}
                                </span>
                            </div>

                        </template>
                    </el-table-column>

<!--                    <el-table-column-->
<!--                            label="Description"-->
<!--                            sortable-->
<!--                            :show-overflow-tooltip="true"-->
<!--                            prop="description">-->
<!--                        <template slot-scope="scope">-->
<!--                            {{scope.row.data_set.description }}-->
<!--                        </template>-->
<!--                    </el-table-column>-->

                    <el-table-column
                            label="Type"
                            sortable
                            prop="type">
                        <template slot-scope="scope">
                            <span class="filetype-badge">
                                {{ (scope.row.data_set.tags.length === 0) ? '.JSON' :  scope.row.data_set.tags[0] }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            width="110px"
                            label="Price"
                            sortable
                            prop="price">
                        <template slot-scope="scope">
                            <span class="black-text">
                                <b>{{(scope.row.ot_objects) ? scope.row.ot_objects[0].price + ' TRAC' : 'Price not provided' }}</b>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="Purchase Status"
                            sortable
                            width="150px"
                            prop="status">
                        <template slot-scope="scope">
                            <p class="purchase-status">
                                <span class="purchased" v-if="scope.row.status === 'COMPLETED'">
                                    {{ scope.row.status }}
                                </span>

                                <span v-else>
                                    {{ scope.row.status }}
                                </span>

                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <div class="d-flex justify-content-around width-100">
                                <el-button
                                        class="margin-right-6"
                                        round
                                        size="mini"
                                        @click="verifyIntegrity(scope.row)">
                                    VERIFY INTEGRITY
                                </el-button>
                                <el-button
                                        class="margin-right-6 blue-button"
                                        round
                                        type="primary"
                                        size="mini"
                                        @click="downloadDataset(scope.row)">
                                    DOWNLOAD
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </data-tables>
            </div>
        </div>
    </div>
</template>

<script>
    import DownloadUtilities from "../DownloadUtilities";

    export default {
        name: "MyPurchases",
        data() {
            return {
                showTableWithPagination: true,
                purchaseData: [],
                paginationProps: {
                    pageSizes: []
                },
                purchaseDataTableProps: {
                    defaultSort: {
                        // prop: '',
                        // order: 'descending'
                    }
                },
                node_address: '',
                datasetsData: [],
                downloadStatusNotification : {}
            }
        },
        created() {

            this.resolveTableResponsivness();

        },
        mounted() {
            EventBus.$emit('calculate-app-height');

            this.node_address = localStorage.getItem('node_address');

            this.fetchPurchasesData();
        },
        methods: {
            trimText2(text){
                let length = 8;
                let clamp = '...';
                let node = document.createElement('div');
                node.innerHTML = text;
                let content = node.textContent;
                return content.length > length ? content.slice(0, length) + clamp : content;
            },
            trimText3(text){
                let length = 15;
                let clamp = '...';
                let node = document.createElement('div');
                node.innerHTML = text;
                let content = node.textContent;
                return content.length > length ? content.slice(0, length) + clamp : content;
            },
            verifyIntegrity(dataset) {
                console.log(dataset, 'datast');

                window.open(`https://explorer.origintrail.io/data-sets/?query=${dataset.ot_json_object_id}&type=id&externalRequest=true&network=marketplace`, '_blank');
            },
            fetchPurchasesData() {
                axios({
                    method: 'get',
                    url: `https://${window.node_address}:8900/api/latest/private_data/trading_info/PURCHASED`
                }).then(response => {

                    if(response.data) {

                        this.datasetsData = response.data;

                        EventBus.$emit('calculate-app-height');
                    } else {

                        this.$notify({
                            message: 'Something went wrong with loading of data, check connection with node!',
                            type: 'warning'
                        });
                    }

                });
            },
            downloadDataset(dataset) {
                this.downloadStatusNotification = this.$notify.info({
                    title: 'Download status',
                    message: 'Download in progress..please wait.',
                });
                this.makeDatasetExport(dataset);
            },
            makeDatasetExport(dataset) {

                let requestBody = {
                    "dataset_id": dataset.data_set.id,
                    "standard_id": "OT-JSON"
                };

                axios({
                    method: 'post',
                    url: `https://${window.node_address}:8900/api/latest/export`,
                    data: requestBody,
                    header: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }).then(response => {

                    if(response.data) {

                        let export_handler = response.data.handler_id;

                        this.checkExportHandler(export_handler, dataset);


                    } else {

                        this.$notify({
                            message: 'Something went wrong with data export!',
                            type: 'warning'
                        });
                    }

                });
            },
            checkExportHandler(export_handler, dataset) {
                axios({
                    method: 'get',
                    url: `https://${window.node_address}:8900/api/latest/export/result/${export_handler}`,
                }).then(response => {

                    if(response.data) {

                        this.downloadStatusNotification.close();

                        if(response.data.status === 'PENDING') {
                            this.checkExportHandler(export_handler);

                        } else if (response.data.status === 'COMPLETED') {

                            let data = response.data.data;
                            let filename = dataset.data_set.name;

                            DownloadUtilities.saveJson(data, filename);

                            this.$notify({
                                title: 'Download status',
                                message: 'Download completed!',
                                type: 'success'
                            });

                        }

                    } else {

                        this.$notify({
                            message: 'Something went wrong with data export!',
                            type: 'warning'
                        });
                    }

                });
            },
            resolveTableResponsivness() {

                if (screen.width < 480) {
                    this.paginationProps.pageSize = this.purchaseData.length;
                    this.paginationProps.total = this.purchaseData.length;
                    this.paginationProps.pageSizes.push(this.purchaseData.length)
                    this.paginationProps.hideOnSinglePage = true;

                } else {
                    this.paginationProps.pageSizes.push(10, 20, 50)
                }

            }
        },
        filters: {
            stringToUppercase(value) {
                return value.toUpperCase();
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
    @import "../scss/_my-purchases.scss";

</style>
