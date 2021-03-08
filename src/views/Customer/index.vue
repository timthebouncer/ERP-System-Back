<template>
  <div class="container">
    <div class="action">
      <div class="addM">
        <a-button class="button1" @click="showModal"
          >新增
          <a-icon type="plus" />
        </a-button>
        <a-modal
          v-model="visible"
          :title="changeTitle"
          width="1000px"
          @cancel="clearInput"
        >
          <div class="modal-body">
            <a-form-model
              :model="list"
              layout="horizontal"
              ref="ruleForm"
              :rules="rules"
            >
              <div class="firstPart">
                <div class="firstPart-item">
                  <!--                  <a-form-model-item class="custom-form-item" label="客戶編號">-->
                  <!--                    <div>{{ list.id }}</div>-->
                  <!--                  </a-form-model-item>-->
                  <a-form-model-item
                    class="custom-form-item"
                    label="客戶類別"
                    prop="classes"
                  >
                    <a-select v-model="list.classes.id" placeholder="請選擇">
                      <a-select-option v-for="item in classify" :key="item.id">
                        {{ item.className }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item
                    class="custom-form-item"
                    label="客戶名稱"
                    prop="name"
                  >
                    <a-input v-model="list.name" placeholder="請輸入" />
                  </a-form-model-item>
                </div>
                <div class="firstPart-item">
                  <a-form-model-item
                    class="custom-form-item"
                    label="客戶電話"
                    prop="tel"
                  >
                    <a-input v-model="list.tel" placeholder="請輸入" />
                  </a-form-model-item>
                  <a-form-model-item
                    class="custom-form-item"
                    label="Email"
                    prop="email"
                  >
                    <a-input v-model="list.email" placeholder="請輸入" />
                  </a-form-model-item>
                </div>
                <a-form-model-item
                  class="custom-form-item address"
                  label="聯絡地址"
                  prop="postCode"
                >
                  <a-input
                    v-model="list.postCode"
                    style="width: 10%"
                    placeholder="郵遞區號"
                  />
                  <a-input v-model="list.address" placeholder="請輸入" />
                </a-form-model-item>

                <a-form-model-item
                  class="custom-form-item"
                  label="備註"
                >
                  <div>
                    <a-input
                      style="width: 825px"
                      v-model="list.remark"
                      placeholder="請輸入"
                    />
                  </div>
                </a-form-model-item>
              </div>
              <a-collapse
                class="collapse"
                default-active-key="1"
                :bordered="false"
              >
                <a-collapse-panel key="1" header="進階">
                  <div class="secondPart">
                    <div class="secondPart-item">
                      <a-form-model-item
                        class="custom-form-item"
                        label="公司名稱"
                      >
                        <a-input
                          v-model="list.companyName"
                          placeholder="請輸入"
                          style="width: 200px"
                        />
                      </a-form-model-item>

                      <a-form-model-item
                        class="custom-form-item"
                        label="統一編號"
                        prop="vatNumber"
                      >
                        <a-input
                          v-model="list.vatNumber"
                          placeholder="請輸入"
                          style="width: 200px"
                        />
                      </a-form-model-item>

                      <a-form-model-item
                        class="custom-form-item"
                        label="公司電話"
                        prop="companyTel"
                      >
                        <a-input
                          v-model="list.companyTel"
                          placeholder="請輸入"
                          style="width: 200px"
                        />
                      </a-form-model-item>

                      <a-form-model-item
                        class="custom-form-item"
                        label="公司傳真"
                        prop="companyFax"
                      >
                        <a-input
                          v-model="list.companyFax"
                          placeholder="請輸入"
                          style="width: 200px"
                        />
                      </a-form-model-item>

                      <a-form-model-item
                        class="custom-form-item"
                        label="公司Email"
                        prop="companyEmail"
                      >
                        <a-input
                          v-model="list.companyEmail"
                          placeholder="請輸入"
                          style="width: 200px; margin-right: 312px"
                        />
                      </a-form-model-item>
                    </div>
                    <a-form-model-item
                      class="custom-form-item address"
                      label="公司地址"
                      prop="companyPostCode"
                    >
                      <a-input
                        style="width: 10%"
                        v-model="list.companyPostCode"
                        placeholder="郵遞區號"
                      />
                      <a-input
                        v-model="list.companyAddress"
                        placeholder="請輸入"
                      />
                    </a-form-model-item>
                    <div class="contact-form">
                      <a-form-model-item
                        class="custom-form-item"
                        label="聯絡人"
                      >
                        <a-input
                          v-model="list.contactPerson"
                          placeholder="請輸入"
                          style="width: 200px"
                        />
                      </a-form-model-item>
                      <a-form-model-item
                        class="custom-form-item"
                        label="連絡電話"
                      >
                        <a-input
                          v-model="list.contactPersonTel"
                          placeholder="請輸入"
                          style="width: 200px"
                        />
                      </a-form-model-item>
                      <a-form-model-item class="custom-form-item" label="分機">
                        <a-input
                          v-model="list.contactPersonTelExt"
                          placeholder="請輸入"
                          style="width: 200px"
                        />
                      </a-form-model-item>
                      <a-form-model-item
                        class="custom-form-item"
                        label="對帳聯絡人"
                      >
                        <a-input
                          v-model="list.reconciliationContactPerson"
                          placeholder="請輸入"
                          style="width: 200px"
                        />
                      </a-form-model-item>
                      <a-form-model-item
                        class="custom-form-item"
                        label="連絡電話"
                      >
                        <a-input
                          v-model="list.reconciliationContactPersonTel"
                          placeholder="請輸入"
                          style="width: 200px"
                        />
                      </a-form-model-item>
                      <a-form-model-item class="custom-form-item" label="分機">
                        <a-input
                          v-model="list.reconciliationContactPersonTelExt"
                          placeholder="請輸入"
                          style="width: 200px"
                        />
                      </a-form-model-item>
                      <a-form-model-item
                        class="custom-form-item"
                        label="採購聯絡人"
                      >
                        <a-input
                          v-model="list.procurementContactPerson"
                          placeholder="請輸入"
                          style="width: 200px"
                        />
                      </a-form-model-item>
                      <a-form-model-item
                        class="custom-form-item"
                        label="連絡電話"
                      >
                        <a-input
                          v-model="list.procurementContactPersonTel"
                          placeholder="請輸入"
                          style="width: 200px"
                        />
                      </a-form-model-item>
                      <a-form-model-item class="custom-form-item" label="分機">
                        <a-input
                          v-model="list.procurementContactPersonTelExt"
                          placeholder="請輸入"
                          style="width: 200px"
                        />
                      </a-form-model-item>
                    </div>
                  </div>
                </a-collapse-panel>
              </a-collapse>
              <div class="third-part">
                <div class="third-part-item">
                  <div>
                    <div>
                      收件資料
                      <a-button
                        type="primary"
                        size="small"
                        class="editable-add-btn"
                        @click="handleAddReceiver"
                      >
                        <a-icon type="plus" />
                      </a-button>
                    </div>
                    <a-form-model
                      class="option-wrapper"
                      :model="list"
                      layout="horizontal"
                      ref="ruleForm"
                      :rules="rules"
                    >
                      <a-form-model-item>
                        <a-radio-group
                          v-model="receiveInfo"
                          @change="receiveChange"
                        >
                          <a-form-model-item
                            label="同客戶資料"
                            class="option-content"
                          >
                            <a-radio :value="0">
                              設為預設收件地址
                            </a-radio>
                          </a-form-model-item>
                          <a-form-model-item
                            label="同公司資料"
                            class="option-content"
                          >
                            <a-radio :value="1">
                              設為預設收件地址
                            </a-radio>
                          </a-form-model-item>
                          <a-form-model-item
                            v-for="(item, index) in recipientList"
                            :key="item.id"
                          >
                            <a-radio :value="(index += 2)">
                              設為預設收件地址
                              <div class="custom-address" style="position: relative;margin-bottom: -32px;left: -10px;">
                                <a-form-model-item
                                  class="custom-form-item"
                                  label="*收件人"
                                  prop=""
                                >
                                  <a-input
                                    v-model="item.receiver"
                                    placeholder="請輸入"
                                  />
                                </a-form-model-item>
                                <a-form-model-item
                                  class="custom-form-item"
                                  label="收件電話"
                                >
                                  <a-input
                                    v-model="item.tel"
                                    style="width: 200px"
                                    placeholder="請輸入"
                                  />
                                </a-form-model-item>
                              </div>
                            </a-radio>
                            <a-form-model-item
                              class="custom-form-item"
                              label="收件地址"
                              prop="receiverPostCode"
                              style="position: relative; left: -10px"
                            >
                              <div style="display: flex;">
                                <a-input
                                  style="width: 82px; margin-right: 5px"
                                  placeholder="郵遞區號"
                                  v-model="item.postCode"
                                />
                                <a-input
                                  style="width: 376px;"
                                  v-model="item.address"
                                  placeholder="請輸入"
                                />
                              </div>
                            </a-form-model-item>
                          </a-form-model-item>
                        </a-radio-group>
                      </a-form-model-item>
                    </a-form-model>
                  </div>

                  <div>
                    商品折扣
                    <a-button
                      type="primary"
                      size="small"
                      class="editable-add-btn"
                      @click="handleAdd"
                    >
                      <a-icon type="plus" />
                    </a-button>
                    <template>
                      <a-table
                        class="discountTable"
                        bordered
                        :data-source="discountTable"
                        :columns="columns2"
                        :rowKey="record => record.id"
                        :pagination="{
                          newCurrent,
                          pageSizeOptions,
                          newPageSize
                        }"
                        @change="discountTableChange"
                      >
                      </a-table>
                      <!--                      <a-pagination-->
                      <!--                          class="pagination"-->
                      <!--                          v-model="current"-->
                      <!--                          :page-size-options="pageSizeOptions"-->
                      <!--                          :total="total"-->
                      <!--                          show-size-changer-->
                      <!--                          :page-size="pageSize"-->
                      <!--                          @change="discountTableChange"-->
                      <!--                          @showSizeChange="discountTableChange"-->
                      <!--                      >-->
                      <!--                        <template slot="buildOptionText" slot-scope="props">-->
                      <!--                        <span v-if="props.value !== '50'"-->
                      <!--                        >{{ props.value }}筆/頁</span-->
                      <!--                        >-->
                      <!--                          <span v-if="props.value === '50'">全部</span>-->
                      <!--                        </template>-->
                      <!--                      </a-pagination>-->
                    </template>
                  </div>
                </div>
              </div>
            </a-form-model>
          </div>
          <template slot="footer">
            <div v-if="list.updateTime">
              <span
                >上次更新時間: {{ list.updateTime.split(' ')[0]
                }}<span style="display: inline-block; width: 10px;" />
                {{ list.updateTime.split(' ')[1] }}</span
              >
            </div>
            <a-button key="back" @click="handleCancel">
              取消
            </a-button>
            <a-button
                    key="submit"
                    type="primary"
                    :loading="loading"
                    @click="handleOk()"
            >
              儲存
            </a-button>
            <a-button
              v-show="changeTitle === '新增客戶'"
              type="primary"
              :loading="loading"
              @click="submitNonstop()"
            >
              儲存並新增
            </a-button>
          </template>
        </a-modal>
      </div>

      <div class="search-wrapper">
        <a-select
          class="search-select"
          v-model="match.name"
          style="width: 100px"
          @change="customerSelection"
        >
          <a-select-option value="">
            全部
          </a-select-option>
          <a-select-option v-for="item in classify" :key="item.className">
            {{ item.className }}
          </a-select-option>
        </a-select>
        <div class="search-input">
          <a-input-search
            v-model="search"
            placeholder="搜尋資料"
            enter-button
            AutoFoucus
            @search="searchHandler"
          />
        </div>
      </div>
    </div>
    <div class="itemMenu">
      <a-table
        :columns="columns"
        :data-source="tableData"
        bordered
        :pagination="false"
        :rowKey="record => record.id"
      >
        <template
          v-for="col in [
            'order',
            'id',
            'classes.name',
            'name',
            'tel',
            'companyName',
            'vatNumber',
            'contactPerson',
            'companyTel'
          ]"
          :slot="col"
          slot-scope="text, record, index"
        >
          <div :key="col">
            <template v-if="col === 'order'">
              {{ index + 1 }}
            </template>
            <template>
              {{ text }}
            </template>
          </div>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-space>
            <a-button type="link" size="small" @click="editHandler(record)"
              >編輯
            </a-button>
            <a-popconfirm
              title="客戶資料刪除後，所有資料將清空無法還原"
              @confirm="() => onDelete(record)"
            >
              <a-button type="link" size="small">刪除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </div>
    <!--分頁-->
    <a-pagination
      class="pagination"
      v-model="current"
      :page-size-options="pageSizeOptions"
      :total="total"
      show-size-changer
      :page-size="pageSize"
      :show-total="total => `總共 ${total} 筆`"
      @change="onPageChange"
      @showSizeChange="onShowSizeChange"
    >
      <template slot="buildOptionText" slot-scope="props">
        <span>{{ props.value }}筆/頁</span>
        <!--        <span v-if="props.value === '50'">全部</span>-->
      </template>
    </a-pagination>
  </div>
</template>

<script>
import { computedWeight } from '@/unit/dictionary/computed'
import Fragment from '@/components/Fragment'
export default {
  name: 'Customer',
  data() {
    const validatorTelReg = new RegExp(
      /^0((([2-8]|37|49|89|836|82)-?)|9)\d{8}$/
    )
    return {
      form: this.$form.createForm(this),
      receiveInfo: 0,
      recipientList: [],
      newCurrent: 1,
      newPageSizeOptions: ['10', '30', '50', '100'],
      newPageSize: 10,
      loading: false,
      visible: false,
      changeTitle: '',
      search: '',
      barcode: '',
      tableData: [],
      classify: [],
      list: {
        classes: { id: '', className: '' },
        name: '',
        tel: '',
        postCode: undefined,
        address: '',
        email: null,
        remark: null,
        companyName: null,
        vatNumber: '',
        contactPerson: '',
        contactPersonTel: '',
        contactPersonTelExt: '',
        companyTel: null,
        companyFax: null,
        companyEmail: null,
        companyPostCode: '',
        companyAddress: '',
        updateTime: '',
        procurementContactPerson: '',
        procurementContactPersonTel: '',
        procurementContactPersonTelExt: '',
        reconciliationContactPerson: '',
        reconciliationContactPersonTel: '',
        reconciliationContactPersonTelExt: '',
        receiverPostCode: ''
      },
      discountClass: [],
      columns: [
        {
          title: '客戶類別',
          dataIndex: 'classes.name',
          width: '5%',
          align: 'center',
          scopedSlots: { customRender: 'classes.name' }
        },
        {
          title: '客戶名稱',
          dataIndex: 'name',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '電話',
          dataIndex: 'tel',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'tel' }
        },
        {
          title: '公司名稱',
          dataIndex: 'companyName',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'companyName' }
        },
        {
          title: '統一編號',
          dataIndex: 'vatNumber',
          width: '7%',
          align: 'center',
          scopedSlots: { customRender: 'vatNumber' }
        },
        {
          title: '聯絡人',
          dataIndex: 'contactPerson',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'contactPerson' }
        },
        {
          title: '公司電話',
          dataIndex: 'companyTel',
          width: '6%',
          align: 'center',
          scopedSlots: { customRender: 'companyTel' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: '7%',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      rules: {
        classes: [{ required: true, message: '請選擇', trigger: 'blur' }],
        name: [{ required: true, message: '請輸入姓名', trigger: 'blur' }],
        tel: [
          {
            required: true,
            pattern: validatorTelReg,
            message: '請輸入正確電話格式',
            trigger: 'blur'
          }
        ],
        vatNumber: [
          { pattern: /^\d+$/, message: '請輸入數字', trigger: 'blur' }
        ],
        postCode: [
          { pattern: /^\d+$/, message: '請輸入數字', trigger: 'blur' }
        ],
        companyPostCode: [
          { pattern: /^\d+$/, message: '請輸入數字', trigger: 'blur' }
        ],
        email: [
          {
            type: 'email',
            message: '請輸入正確email格式(XXX@XXX.com)',
            trigger: 'blur'
          }
        ],
        companyTel: [
          {
            pattern: validatorTelReg,
            message: '請輸入正確電話格式',
            trigger: 'blur'
          }
        ],
        companyEmail: [
          {
            type: 'email',
            message: '請輸入正確email格式(XXX@XXX.com)',
            trigger: 'blur'
          }
        ],
        companyFax: [
          {
            pattern: validatorTelReg,
            message: '請輸入正確傳真號碼格式',
            trigger: 'blur'
          }
        ],
        receiverPostCode: [
          {
            pattern: /^\d+$/,
            message: '請輸入數字',
            trigger: 'blur'
          }
        ]
      },
      discountTable: [],
      columns2: [
        {
          title: '商品名稱',
          dataIndex: 'productName',
          align: 'center',
          customRender: (value, row, index = 1) => {
            if (row.name === '') {
              return {
                children: (
                  <div>
                    <a-select
                      value={row.productId}
                      placeholder="請選擇"
                      onChange={id =>
                        this.pushValue(
                          id,
                          (index =
                            (this.newCurrent - 1) * this.newPageSize + index)
                        )
                      }
                      show-search
                      filter-option={this.filterOption}
                    >
                      {this.discountClass.map(item => (
                        <a-select-option
                          value={item.id}
                          disabled={this.productList[item.id]}
                        >
                          {item.name}
                        </a-select-option>
                      ))}
                    </a-select>
                  </div>
                )
              }
            } else {
              return <div>{row.name}</div>
            }
          },
          scopedSlots: { customRender: 'productName' }
        },
        {
          title: '計價單位',
          dataIndex: 'unit',
          align: 'center',
          scopedSlots: { customRender: 'unit' }
        },
        {
          title: '單價',
          dataIndex: 'salesPrice',
          align: 'center',
          scopedSlots: { customRender: 'salesPrice' }
        },
        {
          title: '出貨單價',
          dataIndex: 'discountPrice',
          align: 'center',
          width: 100,
          customRender: (val, row) => {
            return this.priceAndRemarkEditor(val, row, 'discountPrice')
          },
          scopedSlots: { customRender: 'discountPrice' }
        },
        {
          title: '備註',
          dataIndex: 'remark',
          align: 'center',
          width: 200,
          customRender: (val, row) => {
            return this.priceAndRemarkEditor(val, row, 'remark')
          },
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          // width: "2%",
          align: 'center',
          customRender: (value, row, index) => ({
            children: (
              <div>
                {this.discountTable.length ? (
                  <div>
                    <a-popconfirm
                      title="確定要刪除嗎?"
                      onConfirm={() =>
                        this.deleteDiscount(
                          row,
                          (index = (this.current - 1) * this.pageSize + index)
                        )
                      }
                    >
                      <a>刪除</a>
                    </a-popconfirm>
                  </div>
                ) : (
                  <span>{row}</span>
                )}
              </div>
            )
          }),
          scopedSlots: { customRender: 'operation' }
        }
      ],
      pageSizeOptions: ['10', '30', '50', '100'],
      current: 1,
      pageSize: 10,
      total: 30,
      match: { id: '', name: '' },
      switches: true,
      productList: {}
    }
  },
  created() {
    this.getCustomerList()
    this.$api.Customer.getClass()
      .then(res => {
        this.classify = res.data
      })
      .catch(err => {
        console.log(err)
      })
    this.$api.Commodity.getCommodityDetail({
      searchKey: this.search,
      barcode: this.barcode
    }).then(res => {
      this.discountClass = res.data
    })
    // }
  },
  computed: {
    ListpostCode() {
      return parseInt(this.list.postCode, 10)
    },
    priceAndRemarkEditor() {
      return (val, row, key) => {
        let editKey =
          'isEdit' + key[0].toUpperCase() + key.substring(1, key.length)
        // let editKey = key==='remark'?'isEditRemark':'isEditDiscountPrice';
        if (row.using === false) {
          return <div>{row[key]}</div>
        } else {
          return {
            children: (
              <div class="displayInput">
                {this.changeTitle === '編輯客戶' ? (
                  row[editKey] ? (
                    <Fragment>
                      <span onClick={() => this.inputORnot(row, editKey)}>
                        {val}
                      </span>
                      <div class="displayEdit" />
                      <a-icon
                        class="editable-cell-icon"
                        type="edit"
                        onClick={() => this.inputORnot(row, editKey)}
                      />
                    </Fragment>
                  ) : (
                    <div>
                      <a-input
                        autoFocus
                        placeholder="請輸入"
                        value={row[key]}
                        vModel={row[key]}
                        vOn:Keyup_enter={() => this.addNewItem(row, editKey)}
                        onKeyup={() =>
                          key === 'discountPrice' &&
                          (row[key] = row[key].replace(/[^\d]/g, ''))
                        }
                      />
                    </div>
                  )
                ) : row[editKey] ? (
                  <div>
                    <a-input
                      autoFocus
                      placeholder="請輸入"
                      value={row[key]}
                      vModel={row[key]}
                      vOn:Keyup_enter={() => this.addNewItem2(row, editKey)}
                      onKeyup={() =>
                        key === 'discountPrice' &&
                        (row[key] = row[key].replace(/[^\d]/g, ''))
                      }
                    />
                  </div>
                ) : (
                  <Fragment>
                    <span onClick={() => this.inputORnot2(row, editKey)}>
                      {val}
                    </span>
                    <div class="displayEdit" />
                    <a-icon
                      class="editable-cell-icon"
                      type="edit"
                      onClick={() => this.inputORnot(row, editKey)}
                    />
                  </Fragment>
                )}
              </div>
            )
          }
        }
      }
    },
    filterProductList() {
      return this.discountClass.filter(item => {
        /*
         * productList
         * {
         *   [productId]: true,
         * }
         * { 1: true, 2: true... }
         * */
        return !this.productList[item.id]
      })
    }
  },
  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    addNewItem(row, editKey) {
      row[editKey] = true
    },
    inputORnot(row, editKey) {
      row[editKey] = false
    },
    addNewItem2(row, editKey) {
      row[editKey] = false
    },
    inputORnot2(row, editKey) {
      row[editKey] = true
    },
    getCustomerList() {
      this.$api.Customer.getList({
        searchKeyword: this.search,
        className: this.match.name,
        pageNumber: this.current,
        pageSize: this.pageSize
      })
        .then(res => {
          this.total = res.data.totalElements
          this.tableData = res.data.content
        })
        .catch(err => {
          console.log(err)
        })
    },
    customerSelection() {
      this.$myutils.gotoPageOne.call(this)
    },
    showModal() {
      this.visible = true
      this.changeTitle = '新增客戶'
      this.productList = []
      this.newCurrent = 1
      this.newPageSize = 10
      this.receiveInfo = 0
      this.recipientList = [
        {
          address: '',
          id: '',
          postCode: '',
          receiver: '',
          tel: ''
        }
      ]
    },
    clearInput() {
      this.list = {
        classes: {},
        name: '',
        cellphone: '',
        companyName: '',
        vatNumber: '',
        contactPerson: '',
        tel: '',
        address: '',
        fax: '',
        email: '',
        reference: '',
        companyEmail: '',
        companyPostCode: '',
        companyAddress: '',
        contactPersonTel: '',
        contactPersonTelExt: '',
        procurementContactPerson: '',
        procurementContactPersonTel: '',
        procurementContactPersonTelExt: '',
        reconciliationContactPerson: '',
        reconciliationContactPersonTel: '',
        reconciliationContactPersonTelExt: ''
      }
      this.discountTable = []
      this.receiveInfo = ''
      this.resetForm()
    },
    submitNonstop() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.changeTitle === '新增客戶') {
            this.$api.Customer.add({
              ...this.list,
              classesId: this.list.classes.id,
              defaultReceiveInfo: this.receiveInfo,
              discountList: this.discountTable.map(item => {
                return {
                  discountId: '',
                  productId: item.productId,
                  discountPrice: item.discountPrice,
                  remark: item.remark,
                  unit: item.unit
                }
              })
            })
              .then(() => {
                this.getCustomerList()
                this.keepSelection()
                this.$message.success('新增客戶成功')
              })
              .catch(err => {
                console.log(err)
                this.$message.error('新增客戶失敗')
              })
            this.visible = true
            this.clearInput()
          }
        }
      })
    },
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.changeTitle === '新增客戶') {
            if (
              this.receiveInfo > 1 &&
              this.recipientList.some(item => item.receiver === '')
            ) {
              this.$message.error('請填寫收件人')
            } else {
              this.$api.Customer.add({
                ...this.list,
                classesId: this.list.classes.id,
                defaultReceiveInfo: this.receiveInfo,
                recipientList: this.recipientList.filter(
                  item => item.receiver !== ''
                ),
                discountList: this.discountTable.map(item => {
                  return {
                    discountId: '',
                    productId: item.productId,
                    discountPrice: item.discountPrice,
                    remark: item.remark,
                    unit: item.unit
                  }
                })
              })
                .then(() => {
                  this.getCustomerList()
                  this.$message.success('新增客戶成功')
                })
                .catch(err => {
                  console.log(err)
                  this.$message.error('新增客戶失敗')
                })
              this.visible = false
              this.clearInput()
            }
          } else {
            this.$api.Customer.update({
              ...this.list,
              classesId: this.list.classes.id,
              clientId: this.track,
              defaultReceiveInfo: this.receiveInfo,
              recipientList: this.recipientList,
              discountList: this.discountTable.map(item => {
                return {
                  discountId: item.id,
                  productId: item.productId,
                  discountPrice: item.discountPrice,
                  remark: item.remark
                }
              })
            })
              .then(() => {
                this.getCustomerList()
                this.$message.success('編輯客戶成功')
              })
              .catch(err => {
                console.log(err)
                this.$message.error('編輯客戶失敗')
              })
            this.visible = false
            this.clearInput()
          }
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    handleCancel() {
      this.visible = false
      this.clearInput()
    },
    editHandler(record) {
      this.newCurrent = 1
      this.newPageSize = 10
      this.track = record.id
      this.changeTitle = '編輯客戶'
      this.$api.Customer.getSingleList(record)
        .then(res => {
          this.discountTable = []
          if (res.data !== '') {
            // if(record.defaultReceiveInfo > 1){
            this.recipientList = res.data.recipientList
            // }else {
            //   this.recipientList = [{
            //     address: "",
            //     id: "",
            //     postCode: "",
            //     receiver: "",
            //     tel: "",
            //   }]
            // }
            this.list = res.data
            this.receiveInfo = res.data.defaultReceiveInfo
            this.$api.Customer.discountNoPages({
              clientId: this.track
            })
              .then(res => {
                this.discountTable = res.data.map(d => ({
                  id: d.discountId,
                  name: d.productName,
                  productId: d.productId,
                  unit: computedWeight(d.productUnit),
                  salesPrice: d.price,
                  discountPrice: d.clientPrice,
                  remark: d.remark,
                  isEditDiscountPrice: true,
                  isEditRemark: true,
                  using: d.using,
                  updateTime: d.updateTime
                }))
                this.keepSelection()
              })
              .catch(() => {
                this.keepSelection()
              })
            this.visible = true
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    onDelete(record) {
      console.log(record)
      this.$api.Customer.delete(record)
        .then(() => {
          this.getCustomerList()
          this.$message.success(`${record.name}刪除成功`)
        })
        .catch(err => {
          console.log(err)
          this.$message.error('刪除客戶失敗')
        })
    },
    onShowSizeChange(current, pageSize) {
      // console.log(current);
      this.current = 1
      this.pageSize = pageSize
      this.getCustomerList(this.search)
    },
    onPageChange(current) {
      this.getCustomerList(this.search)
    },
    discountTableChange({ current, pageSize }) {
      console.log(current, pageSize)
      this.newCurrent = current
      this.newPageSize = pageSize
    },
    searchHandler() {
      this.$myutils.gotoPageOne.call(this)
    },
    async deleteDiscount(row, index) {
      if (this.changeTitle === '新增客戶') {
        this.discountTable.splice(index, 1)
        this.keepSelection()
      } else {
        if (row.id) {
          try {
            await this.$api.Customer.discountRemove(row)
            this.discountTable.splice(index, 1)
            this.$message.success('刪除折扣成功')
            this.keepSelection()
          } catch (err) {
            this.$message.error('刪除折扣失敗')
            console.log(err)
          }
        } else {
          this.discountTable.splice(index, 1)
          this.keepSelection()
        }
      }
      if ((index % 10) + 1 === 1 && index !== 0) {
        this.current--
      }
    },
    keepSelection() {
      this.productList = this.discountTable.reduce((p, v) => {
        return v.productId ? { ...p, [v.productId]: true } : p
      }, {})
    },
    handleAddReceiver() {
      let receiveList = this.recipientList.every(item => item.receiver !== '')
      if (receiveList) {
        this.recipientList.push({
          address: '',
          id: '',
          postCode: '',
          receiver: '',
          tel: ''
        })
      }
    },
    handleAdd() {
      const { discountTable } = this
      const newData = {
        productId: undefined,
        name: '',
        unit: '',
        salesPrice: null,
        discountPrice: undefined,
        remark: '',
        isEditDiscountPrice: true,
        isEditRemark: true
      }
      this.discountTable = [...discountTable, newData]
    },
    pushValue(id, index) {
      this.discountTable[index].productId = id
      this.productList = this.discountTable.reduce((p, v) => {
        return v.productId ? { ...p, [v.productId]: true } : p
      }, {})
      this.$api.Commodity.getCommodityDetail({
        searchKey: this.search,
        barcode: this.barcode
      }).then(res => {
        console.log(res)
        let content = res.data
        let result = content.find(item => item.id === id)
        let rows = this.discountTable[index]
        rows.productId = result.id
        rows.unit = computedWeight(undefined, result.unit)
        rows.salesPrice = result.price
        rows.using = result.using
      })
    },
    receiveChange() {
      // if (this.receiveInfo <= 1) {
      //   this.recipientList = [{
      //     address: "",
      //     id: "",
      //     postCode: "",
      //     receiver: "",
      //     tel: "",
      //   }]
      // }
    }
  }
}
</script>

<style scoped lang="scss">
/*::v-deep .ant-layout{*/
/*  height: 0%;*/
/*}*/
::v-deep .ant-modal {
  top: 10px;
}
.firstPart {
  background-color: #f5f5f5;
  padding: 20px 20px 20px 20px;
}

.firstPart-item {
  display: flex;
}

.firstPart-item > div {
  flex: 1;
}

.secondPart {
  margin-top: 20px;
  padding: 30px 20px 30px 20px;
  background-color: #f5f5f5;
}

.secondPart-item {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.third-part {
  margin-top: 10px;
  padding: 20px 20px 20px 20px;
  /*background-color: #f5e9e9;*/
  .editable-add-btn {
    margin-bottom: 15px;

    .discount {
      display: flex;
      align-items: center;
    }

    .discount > button {
      margin-left: 5px;
      float: left;
    }

    .discount-menu {
      margin-top: 5px;
      flex-direction: column;
    }
  }
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

::v-deep .ant-collapse > .ant-collapse-item > .ant-collapse-header {
  margin-bottom: -20px;
}

::v-deep .ant-collapse-content > .ant-collapse-content-box {
  padding: 0px;
}

::v-deep .ant-collapse-borderless > .ant-collapse-item {
  border-bottom: none;
}

::v-deep .ant-collapse > .ant-collapse-item {
  border-bottom: none;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
.discountTable::v-deep .ant-table-row td {
  position: relative;
}
.displayInput {
  display: flex;
  justify-content: center;
}
.displayEdit {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}
.displayEdit:hover + .editable-cell-icon {
  display: block;
  //position: absolute;
}
.editable-cell-icon {
  display: block;
  position: relative;
  z-index: 1;
  cursor: pointer;
  top: 3.5px;
}
.contact-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.option-wrapper {
  background-color: #f5f5f5;
  padding: 10px 0px 0px 60px;
  line-height: 2;
}
.option-content {
  display: flex;
}
.custom-address {
  display: flex;
}
</style>
