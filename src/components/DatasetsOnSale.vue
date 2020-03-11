<template>

    <div class="datasets-on-sale" v-if="!showEditPrice && !showUploadDataset">

        <el-row>
            <h1>Datasets on sale</h1>

            <div class="d-flex justify-content-end">
                <el-button
                        type="primary"
                        round
                        class="blue-button"
                        size="mini"
                        @click="uploadDatasetOpen">
                    <img class='cloud-logo' src="../assets/cloud-upload.svg"/> PUT DATASET ON SALE
                </el-button>
            </div>

            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="All Datasets" name="first">
                    <data-tables
                            ref="multipleTable"
                            :data="datasetsData"
                            :lazy="false"
                            style="width: 100%"
                            :table-props="tableProps"
                            @selection-change="handleSelectionChange"
                            :pagination-props="{ pageSizes: [8, 16, 20, 24] }">
                        <el-table-column
                                label="Name of Dataset"
                                property="dataset_name">
                            <template slot-scope="scope">
                                <img class="dataset-icon" src="~@/assets/id-ic-dataset.svg" alt="">
                                <span class="black-text" style="font-weight: bold;">
                                    {{ (scope.row.dataset.name === '') ? 'Name not provided' : scope.row.dataset.name }}
                                    <br>
                                    <span class="time">{{scope.row.timestamp}}</span>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="Description"
                                property="description">
                            <template slot-scope="scope">
                                {{scope.row.dataset.description | trimText}}
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="Type"
                                property="type"
                                width="140px"
                        >
                            <template slot-scope="scope">
                            <span class="filetype-badge">
                                {{ (scope.row.dataset.tags.length === 0) ? '.JSON' :  scope.row.dataset.tags[0] }}
                            </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="Sold"
                                width="140px"
                                property="sold">
                            <template slot-scope="scope">
                                SOLD {{scope.row.total_sales }} TIMES
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="Price"
                                width="110px"
                                property="price">
                            <template slot-scope="scope" class="black-text">
                            <span class="black-text">
                                <b>{{scope.row.ot_objects[0].price | formatPrice}}</b> TRAC
                            </span>
                            </template>
                        </el-table-column>

                        <el-table-column min-width="100px">
                            <template slot-scope="scope">
                                <div class="d-flex justify-content-around width-100">
                                    <el-button
                                            class="margin-right-6"
                                            round
                                            size="mini"
                                            @click="previewDataset(scope.row)">
                                        PREVIEW
                                    </el-button>

                                    <el-button
                                            class="margin-right-6"
                                            round
                                            size="mini"
                                            @click="pausePurchase(scope.row)">
                                        PAUSE
                                    </el-button>

                                    <el-button
                                            round
                                            size="mini"
                                            class="blue-button margin-right-6"
                                            type="primary"
                                            @click="editPriceOpen(scope.row)">
                                        EDIT PRICE
                                    </el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </data-tables>
                </el-tab-pane>

            </el-tabs>
        </el-row>

        <preview-dataset v-if="showPreview" :data="previewData" :title="previewTitle"></preview-dataset>
        <edit-price></edit-price>
    </div>


    <div class="datasets-on-sale" v-else-if="!showEditPrice && showUploadDataset">
        <upload-dataset></upload-dataset>
    </div>

</template>

<script>
    import EditPrice from "./EditPrice";
    import UploadDataset from "./UploadDataset";

    import tagsImages from "../tags-and-images/tags-and-images";
    import PreviewDataset from "./PreviewDataset";

    export default {
        components: {PreviewDataset, EditPrice, UploadDataset},
        props: [''],
        name: "DatasetsOnSale",
        data() {
            return {
                activeName: 'first',
                datasetsData: [],
                tableProps: {
                    defaultSort: {
                        prop: 'timestamp',
                        order: 'descending'
                    }
                },
                multipleSelection: [],
                datasetMock: {
                    dataset_name: 'Dataset name',
                    time: '3 days ago',
                    description: 'Description',
                    type: '.JSON',
                    sold: '12 SOLD',
                    price: '24'
                },
                showEditPrice: false,
                showUploadDataset: false,
                editPriceData: {},
                tagsImages: tagsImages,
                node_address: '',
                previewData: {},
                previewTitle: '',
                showPreview: false,
                exportNotification: {}
            }
        },
        methods: {
            previewDataset(dataset) {
                this.exportNotification = this.$notify.info({
                    title: 'Export status',
                    message: 'Exporting...please wait!',
                });

                this.makeDatasetExport(dataset);
            },
            makeDatasetExport(dataset) {

                let requestBody = {
                    "dataset_id": dataset.dataset.id,
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

                    if (response.data) {

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

                    if (response.data) {

                        if (response.data.status === 'PENDING') {
                            this.checkExportHandler(export_handler);

                        } else if (response.data.status === 'COMPLETED') {

                            let data = response.data.data;
                            let filename = dataset.dataset.name;

                            this.previewData = data;
                            this.previewTitle = filename + '.json';
                            this.showPreview = true;

                            setTimeout(() => {
                                this.exportNotification.close();

                            }, 1500);
                        }

                    } else {

                        this.$notify({
                            message: 'Something went wrong with data export!',
                            type: 'warning'
                        });
                    }

                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            pausePurchase(dataset) {
                let priceNumber = -1 * 1000000000000000000;

                let requestBody = {
                    "data_set_id": dataset.dataset.id,
                    "ot_object_ids": [
                        {
                            "id": dataset.ot_objects[0].id,
                            "price_in_trac": priceNumber
                        }

                    ]
                };

                axios({
                    method: 'post',
                    url: `https://${window.node_address}:8900/api/latest/private_data/update_price`,
                    data: requestBody,
                    header: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }).then(response => {

                    if (response.data.status === 'COMPLETED') {

                        this.$notify({
                            message: 'Selling is paused!',
                            type: 'success',
                            duration: 0
                        });

                        this.datasetsData.forEach((datasetTable, index) => {
                            if (datasetTable.dataset.id === dataset.dataset.id) {
                                datasetTable.ot_objects[0].price = -1 * 1000000000000000000;
                            }
                        });

                    } else {
                        this.$notify({
                            message: 'Something went wrong with pausing!',
                            type: 'error'
                        });
                    }

                });
            },
            editPriceOpen(data) {
                data.index = this.datasetsData.findIndex(el => el.dataset.id === data.dataset.id);
                EventBus.$emit('calculate-app-height');
                EventBus.$emit('open-edit-price-dialog', data);
            },
            handleClick() {

            },
            uploadDatasetOpen() {
                EventBus.$emit('calculate-app-height');
                this.showEditPrice = false;
                this.showUploadDataset = true;
            },
            loadDatasetsOnSale() {

                axios({
                    method: 'get',
                    url: `https://${window.node_address}:8900/api/latest/private_data/owned`
                }).then(response => {

                    if (response.data) {

                        this.datasetsData = response.data;
                    } else {

                        this.$notify({
                            title: 'Import status',
                            message: 'Something went wrong with loading of data, check connection with node!',
                            type: 'warning'
                        });
                    }

                });
            }
        },
        mounted() {

            this.node_address = localStorage.getItem('node_address');

            this.loadDatasetsOnSale();

            EventBus.$on('close-edit-price', () => {
                this.showEditPrice = false;
                this.editPriceData = {};
            });

            window.EventBus.$on('close-upload-dataset', () => {
                EventBus.$emit('calculate-app-height');
                this.showUploadDataset = false;
                setTimeout(() => {
                    this.loadDatasetsOnSale();
                }, 1000);
            });

            EventBus.$on('close-preview-data', () => {
                this.showPreview = false;
            });

            EventBus.$on('change-price', (data) => {
                console.log(data.price, 'comming price');
                this.datasetsData[data.index].ot_objects[0].price = data.price * 1000000000000000000;
            });
        },
        filters: {
            trimText(text) {
                let length = 60;
                let clamp = '...';
                let node = document.createElement('div');
                node.innerHTML = text;
                let content = node.textContent;
                return content.length > length ? content.slice(0, length) + clamp : content;
            },
            formatPrice(val) {
                return val / 1000000000000000000;
            }
        }
    }
</script>

<style>


    .el-notification .el-icon-success {
        padding-top: 8px !important;
    }

    .cloud-logo {
        margin-right: 8px;
    }

</style>
