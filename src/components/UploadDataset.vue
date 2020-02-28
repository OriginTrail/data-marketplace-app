<template>
    <el-row class="width-100">
        <div class="form-wrapper d-flex justify-content-center">
            <el-col :lg="10" :sm="24">
                <el-button @click="backToDatasetOnSale" class="back-button" size="small">BACK</el-button>
                <h1 class="text-left">Put Data on Sale</h1>
                <h3 class="text-left">General Information</h3>
                <p class="text-left">This is publicaly available to all node holders. It is meant to give more
                    information about the data you are selling.</p>
                <el-form ref="uploadDataset" :model="editPrice" label-width="120px" :label-position="labelPosition" :rules="rules">
                    <el-form-item label="Name of Dataset" prop="dataset_name">
                        <el-input v-model="editPrice.dataset_name"></el-input>
                    </el-form-item>
                    <el-form-item label="Select tags" prop="tags">
                        <el-select v-model="editPrice.tags" multiple placeholder="Select">
                            <el-option
                                    v-for="item in tagsOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Description" prop="description">
                        <el-input type="textarea" v-model="editPrice.description"></el-input>
                    </el-form-item>

                    <el-form-item label="Dataset Identifier" prop="d_identifier">
                        <el-input v-model="editPrice.d_identifier"></el-input>
                    </el-form-item>

                    <p class="text-left price-in-usd-upload">This will be used for search query lookups on the
                        network.</p>


                    <h3 class="text-left marging-top-20">Data for Sale</h3>
                    <p class="text-left">This is a private part of the dataset solely accesible to parties who purchase
                        it.</p>

                    <el-form-item prop="user_private_data">
                        <el-input type="textarea" :rows="8" v-model="editPrice.user_private_data"></el-input>
                    </el-form-item>

                    <h3 class="text-left marging-top-20">Price</h3>
                    <p class="text-left">You determine the value and the price of your data. You can later change the
                        price of your data at any time on the “Datasets on Sale” page. The price change will take effect
                        for all future purchases of your data from the time of change on (not valid for data already
                        purchased).</p>


                    <div class="price-wrapper">
                        <el-form-item prop="price">
                            <el-input-number label="Price is in Trace Token" v-model="editPrice.price" :min=min :max=max
                                             @change="recalculatePriceInUSD">

                            </el-input-number>
                            TRAC
                        </el-form-item>
                    </div>

                    <p class="text-left price-in-usd-upload">~ {{ tracPriceInUsdConverted.toFixed(3) }}$</p>

                    <div class="terms-and-conditions-upload-dataset">
                        <el-row>
                            <el-col :span="2">
                                <img src="/images/id-ic-info.svg" alt="">
                            </el-col>
                            <el-col :span="22">
                                <p>
                                    Please be mindful that you are solely liable for the appropriateness, lawfulness,
                                    and accurateness of the data you are putting on sale or in any way processing by
                                    using the Data Marketplace. See Terms & Conditions.
                                </p>
                            </el-col>
                        </el-row>
                    </div>

                    <!--                    <el-form-item class="terms">-->
                    <!--                        <el-checkbox-group v-model="editPrice.terms">-->
                    <!--                            <el-checkbox name="accepted">I accept the Terms & Conditions and Privacy Policy.-->
                    <!--                            </el-checkbox>-->
                    <!--                        </el-checkbox-group>-->
                    <!--                    </el-form-item>-->

                    <el-form-item>
                        <el-button class="put-on-sale-button" type="primary" @click="putOnSale">PUT ON SALE</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </div>

    </el-row>

</template>

<script>


    export default {
        name: "EditPrice",
        data() {
            return {
                min: 0,
                max: 100000,
                editPrice: {
                    dataset_name: '',
                    tags: [],
                    description: '',
                    price: '',
                    terms: '',
                    d_identifier: '',
                    private_data:
                        "[\n" +
                        "          {\n" +
                        "            \"isPrivate\": true,\n" +
                        "            \"data\": {\n" +
                        "            }\n" +
                        "          }\n" +
                        "]",
                    user_private_data: ''
                },
                tracPriceInUsd: '',
                rawData: {
                    testing: 'testing',
                    probica: 'ajmo'
                },
                labelPosition: 'top',
                otJSON: {},
                node_address: '',
                tagsOptions: [{
                    value: 'Sensor Data',
                    label: 'Sensor Data'
                }, {
                    value: 'Geo Data',
                    label: 'Geo Data'
                }, {
                    value: 'Traceability Data',
                    label: 'Traceability Data'
                }, {
                    value: 'Certificate Data',
                    label: 'Certificate Data'
                }, {
                    value: 'Production Data',
                    label: 'Production Data'
                }, {
                    value: 'Master Data',
                    label: 'Master Data'
                }, {
                    value: 'Transportation Data',
                    label: 'Transportation Data'
                }, {
                    value: 'Raw Data',
                    label: 'Raw Data'
                }, {
                    value: 'Other',
                    label: 'Other'
                }],
                tracPriceInUsdConverted: 0,
                rules: {
                    dataset_name: [
                        {required: true, message: 'Please input Dataset name', trigger: 'blur'},
                    ],
                    tags: [
                        {required: true, message: 'Please select available tags', trigger: 'change'}
                    ],
                    description: [],
                    d_identifier: [
                        {required: true, message: 'Please select identifier for dataset', trigger: 'blur'}
                    ],
                    user_private_data: [
                        {
                            required: true,
                            message: 'Please input private data',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        methods: {
            editPriceMethod(dataset_id, otObjectId, price) {

                let priceNumber = price * 1000000000000000000;

                let requestBody = {
                    "data_set_id": dataset_id,
                    "ot_object_ids": [
                        {
                            "id": otObjectId,
                            "price_in_trac": priceNumber.toString()
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

                        // this.$notify({
                        //     title: 'Price edit status',
                        //     message: 'Dataset price updated successfully!',
                        //     type: 'success'
                        // });
                    }

                });
            },
            putOnSale() {

                this.$refs['uploadDataset'].validate((valid) => {
                    if (valid) {

                        let otJSON = this.prepareOTJSON();

                        let requestBody = {};
                        requestBody.file = JSON.stringify(otJSON);
                        requestBody.standard_id = 'OT-JSON';

                        this.importDataset(requestBody).then(response => {

                            if (response.data.handler_id) {

                                this.checkImportStatus(response.data.handler_id);
                            }
                        });


                    } else {

                        this.$notify({
                            message: 'Please provide input for all required field!',
                            type: 'error'
                        });

                        return false;
                    }
                });


            },
            importDataset(requestBody) {
                return axios({
                    method: 'post',
                    url: `https://${window.node_address}:8900/api/latest/import`,
                    data: requestBody,
                    header: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                    },
                });
            },
            checkImportStatus(handler_id) {
                axios({
                    method: 'get',
                    url: `https://${window.node_address}:8900/api/latest/import/result/${handler_id}`,
                }).then(response2 => {

                    if (response2.data.status === 'PENDING') {

                        this.$notify.info({
                            title: 'Import status',
                            message: 'Import in progress..please wait.'
                        });


                        setTimeout(() => {
                            this.checkImportStatus(handler_id);
                        }, 2000);

                    } else if (response2.data.status === 'COMPLETED') {

                        this.dataset_id = response2.data.data.dataset_id;
                        this.otObjectId = this.editPrice.d_identifier;
                        this.price = this.editPrice.price;

                        console.log(response2.data, 'importStatus');

                        this.$notify({
                            title: 'Import status',
                            message: 'Dataset imported successfully!',
                            type: 'success'
                        });

                        this.replicate(response2.data.data);

                    } else if (response2.data.status === 'FAILED') {

                        this.$notify({
                            title: 'Import status',
                            message: 'Something went wrong, please try again!',
                            type: 'warning'
                        });


                    }

                });
            },
            replicate(importStatusData) {
                let queryObject = {};
                queryObject.dataset_id = importStatusData.dataset_id;
                queryObject.token_amount_per_holder = importStatusData.token_amount_per_holder;

                axios({
                    method: 'post',
                    url: `https://${window.node_address}:8900/api/latest/replicate`,
                    data: queryObject,
                    header: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }).then(response3 => {

                    this.$notify.info({
                        title: 'Replication status',
                        message: 'Replication started..'
                    });

                    this.editPriceMethod(this.dataset_id, this.otObjectId, this.price);

                    this.backToDatasetOnSale();

                });
            },
            backToDatasetOnSale() {
                window.EventBus.$emit('close-upload-dataset');
            },
            /**
             * @return {boolean}
             */
            IsJsonString(str) {
                try {
                    JSON.parse(str);
                } catch (e) {
                    return false;
                }
                return true;
            },
            preparePrivateData() {

                let main_private_data_object = JSON.parse(this.editPrice.private_data);

                if (this.IsJsonString(this.editPrice.user_private_data)) {

                    main_private_data_object[0].data = JSON.parse(this.editPrice.user_private_data);

                    this.editPrice.private_data = main_private_data_object;

                } else {

                    main_private_data_object[0].data.data = this.editPrice.user_private_data;

                    this.editPrice.private_data = main_private_data_object;
                }
            },
            prepareOTJSON() {

                this.preparePrivateData();

                console.log(this.editPrice.private_data, 'private');

                let otJSONTemplate = {
                    "@id": "0xe5d4dcd066733f7cc6c1a568ebd3acda4ea4ccc3983a80579412d533ba8920b3",
                    "@type": "Dataset",
                    "datasetHeader": {
                        "OTJSONVersion": "1.0",
                        "datasetCreationTimestamp": "2020-02-21T10:21:58.058Z",
                        "datasetTitle": this.editPrice.dataset_name,
                        "datasetDescription": this.editPrice.description,
                        "datasetTags": [
                            "Sensor Data",
                            "Master Data"
                        ],
                        "relatedDatasets": [],
                        "validationSchemas": {
                            "erc725-main": {
                                "schemaType": "ethereum-725",
                                "networkId": "ganache"
                            },
                            "merkleRoot": {
                                "schemaType": "merkle-root",
                                "networkId": "ganache",
                                "hubContractAddress": "0x0987197628Bb06133B6FA2409eb4cF9FCaFe8d3a"
                            }
                        },
                        "dataIntegrity": {
                            "proofs": [
                                {
                                    "proofValue": "0x2e8615c417a3f9d1ae77b6c31c8ecd3fc95f6909255494a1e258b69c2918f282",
                                    "proofType": "merkleRootHash",
                                    "validationSchema": "/schemas/merkleRoot"
                                }
                            ]
                        },
                        "dataCreator": {
                            "identifiers": [
                                {
                                    "identifierValue": "0x443d771aAfaa3D6Fb66c4a81D97778200a6882D5",
                                    "identifierType": "ERC725",
                                    "validationSchema": "/schemas/erc725-main"
                                }
                            ]
                        }
                    },
                    "@graph": [
                        {
                            "@id": "urn:ot:object:actor:id:Nesium",
                            "@type": "otObject",
                            "identifiers": [
                                {
                                    "@type": "id",
                                    "@value": "urn:ot:object:actor:id:Nesium"
                                }
                            ],
                            "properties": {
                                "private_data": this.editPrice.private_data
                            },
                            "relations": []
                        }
                    ]
                };

                let newTemplate = {
                    "datasetHeader": {
                        "OTJSONVersion": "1.0",
                        "datasetTitle": this.editPrice.dataset_name,
                        "datasetDescription": this.editPrice.description,
                        "datasetTags": this.editPrice.tags
                    },
                    "@graph": [
                        {
                            "@id": this.editPrice.d_identifier,
                            "@type": "otObject",
                            "identifiers": [
                                {
                                    "@type": "id",
                                    "@value": this.editPrice.d_identifier
                                }
                            ],
                            "properties": {
                                "private_data": this.editPrice.private_data
                            },
                            "relations": []
                        }
                    ]
                };

                return newTemplate;
            },
            getPriceForTracInUsd() {
                axios({
                    method: 'get',
                    url: `https://api.coingecko.com/api/v3/simple/price?ids=origintrail&vs_currencies=usd`,
                }).then(response => {
                    this.tracPriceInUsd = response.data.origintrail.usd;
                    console.log(response);
                }).catch((error) => {

                })

            },
            recalculatePriceInUSD() {
                this.tracPriceInUsdConverted = parseFloat(this.editPrice.price) * this.tracPriceInUsd;
            }
        },
        mounted() {
            this.node_address = localStorage.getItem('node_address');
            this.getPriceForTracInUsd();
        },
        watch: {
            datasetPrice() {
                if (this.datasetPrice !== '') {
                    this.tracPriceInUsdConverted = parseFloat(this.datasetPrice) * this.tracPriceInUsd;
                }
            },
        }
    }
</script>

<style scoped>

</style>
