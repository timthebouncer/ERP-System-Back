<template>
  <div class="container">
    <div class="action">
      <div class="addM">
        <a-button class="button1" @click="showModal">新增+</a-button>
        <a-modal v-model="visible" :title=changeTitle width="1000px">
          <div class="modal-body">
            <a-input-group size="default">
              <a-row :gutter="20">
                <div class="allPart">
                  <div class="firstPart">
                    <div>
                      商品名稱
                    </div>
                    <a-col :span="6">
                      <a-input v-model="list.name" placeholder="請輸入" />
                    </a-col>
                    <div>商品條碼</div>
                    <a-col :span="6">
                      <a-input v-model="list.barCode" placeholder="請輸入" />
                    </a-col>
                    <div>單位</div>
                    <a-select v-model="list.unit" style="width: 15%" placeholder="請選擇">
                      <a-select-option value="斤">
                        公斤
                      </a-select-option>
                      <a-select-option value="克">
                        公克
                      </a-select-option>
                      <a-select-option value="件">
                        件
                      </a-select-option>
                      <a-select-option value="台斤">
                        台斤
                      </a-select-option>
                    </a-select>
                  </div>
                  <div class="secondPart">
                    <div>售價</div>
                    <a-col :span="4">
                      <a-input v-model="list.prices" placeholder="請輸入" />
                    </a-col>
                    <div>建議售價</div>
                    <a-col :span="4">
                      <a-input v-model="list.sprices" placeholder="請輸入" />
                    </a-col>
                    <div>成本售價</div>
                    <a-col :span="4">
                      <a-input v-model="list.oprices" placeholder="請輸入" />
                    </a-col>
                  </div>
                  <div class="thirdPart">
                    <div>商品描述</div>
                    <a-col :span="20">
                      <a-input v-model="desc" style="height: 100px;" />
                    </a-col>
                  </div>
                </div>
              </a-row>
            </a-input-group>
          </div>
          <template slot="footer">
            <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
              儲存
            </a-button>
            <a-button key="back" @click="handleCancel">
              取消
            </a-button>
          </template>
        </a-modal>
      </div>

      <div class="search">
        <a-input-search v-model="search" placeholder="搜尋內容" enter-button @click="onSearch" />
      </div>
    </div>
    <div class="itemMenu">
      <a-table :columns="columns" :data-source="filterText" bordered>
        <template
                v-for="col in ['order','barCode','name','unit','prices','sprices','oprices']"
                :slot="col"
                slot-scope="text, record, index"
        >
          <div :key="col">
            <template v-if="col === 'order'">
              {{index+1}}
            </template>
            <template>
              {{ text }}
            </template>
          </div>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-button size="small" @click="editHandler(record)">編輯</a-button>
          <a-popconfirm
                  title="確定要刪除嗎?"
                  @confirm="() => onDelete(record.id)"
          >
            <a-button size="small">刪除</a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
  </div>

</template>
<script>
  import axios from 'axios'

  export default {
    name:"Merchant",
    data() {
      return {
        loading: false,
        visible: false,
        desc:"",
        track:"",
        search:"",
        list:{
          name:"",
          unit:"",
          barCode:"",
          prices:"",
          oprices:"",
          sprices:"",
        },
        tableData:[],
        changeTitle:"",
        columns: [
          {
            title: '序',
            dataIndex: 'order',
            width: '2%',
            align:"center",
            scopedSlots: { customRender: 'order' },
          },
          {
            title: '商品ID',
            dataIndex: '',
            width: '10%',
            align:"center",
            scopedSlots: { customRender: '' },
          },
          {
            title: '商品條碼',
            dataIndex: 'barCode',
            width: '15%',
            align:"center",
            scopedSlots: { customRender: 'barCode' },
          },
          {
            title: '商品名稱',
            dataIndex: 'name',
            width: '15%',
            align:"center",
            scopedSlots: { customRender: 'name' },
          },
          {
            title: '單位',
            dataIndex: 'unit',
            width: '5%',
            align:"center",
            scopedSlots: { customRender: 'unit' },
          },
          {
            title: '售價',
            dataIndex: 'prices',
            width: '10%',
            align:"center",
            scopedSlots: { customRender: 'prices' },
          },
          {
            title: '建議售價',
            dataIndex: 'sprices',
            width: '10%',
            align:"center",
            scopedSlots: { customRender: 'sprices' },
          },
          {
            title: '成本價',
            dataIndex: 'oprices',
            width: '10%',
            align:"center",
            scopedSlots: { customRender: 'oprices' },
          },
          {
            title: '庫存量',
            dataIndex: 'quantity',
            width: '5%',
            align:"center",
            scopedSlots: { customRender: 'quantity' },
          },
          {
            title: '建立時間',
            dataIndex: 'createdTime',
            width: '10%',
            align:"center",
            scopedSlots: { customRender: 'createdTime' },
          },
          {
            title: 'operation',
            dataIndex: 'operation',
            width:'10%',
            align:"center",
            scopedSlots: { customRender: 'operation' },
          },
        ]
      };
    },
    created() {
      axios.get('http://localhost:3000/lists')
              .then((res)=>{
                console.log(res.data)
                this.tableData = res.data
              }).catch((err)=>{
        console.log(err)
      })
    },
    computed:{
      filterText(){
        if(!this.search){
          return this.tableData
        }else {
          return this.tableData.filter(item=>{
            return item.name.includes(this.search)
          })
        }
      }
    },
    methods: {
      showModal() {
        this.visible = true;
        this.changeTitle = "新增商品"
      },
      clearInput(){
        this.list.name = "",
                this.list.barCode = "",
                this.list.prices = "",
                this.list.sprices = "",
                this.list.oprices =""
      },
      handleOk() {
        this.loading = true;
        if(this.changeTitle === "新增商品"){
          axios.post('http://localhost:3000/lists',{
            id:"",
            name:this.list.name,
            unit:this.list.unit,
            barCode:this.list.barCode,
            prices:this.list.prices,
            sprices:this.list.sprices,
            oprices:this.list.oprices
          })
                  .then(()=>{
                    this.clearInput()
                    axios.get('http://localhost:3000/lists')
                            .then((res)=> {
                              this.tableData = res.data
                            })
                  })
          this.visible = false;
          this.loading = false;
        }else{
          // if(this.changeTitle === "編輯商品")
          axios.put('http://localhost:3000/lists/'+this.track,{
            id:this.track,
            name:this.list.name,
            unit:this.list.unit,
            barCode:this.list.barCode,
            prices:this.list.prices,
            sprices:this.list.sprices,
            oprices:this.list.oprices
          })
                  .then(()=>{
                    axios.get('http://localhost:3000/lists')
                            .then((res)=>{
                              this.tableData = res.data
                            })
                  })
          this.visible = false;
          this.loading = false;
        }
      },
      handleCancel(e) {
        this.visible = false;
      },
      editHandler(record){
        this.track = record.id
        this.changeTitle = "編輯商品"
        axios.get('http://localhost:3000/lists/' + record.id)
                .then((res)=>{
                  this.list = res.data
                  this.visible = true;
                })
      },
      onDelete(id) {
        axios.delete('http://localhost:3000/lists/'+ id)
                .then(()=>{
                  axios.get('http://localhost:3000/lists')
                          .then((res)=>{
                            this.tableData = res.data
                          })
                })
      },
      onSearch(){
        if(this.search){
          axios.get('http://localhost:3000/lists')
                  .then((res)=>{
                    this.tableData = res.data
                  })
        }
      },
      // getList(){
      //     axios.get('http://localhost:3000/lists/'+this.search)
      //     .then((res)=>{
      //         this.tableData = res.data
      //     }).catch((err)=>{
      //         console.log(err)
      //     })
      // }
    },
  };
</script>
<style scoped lang="scss">
  .button1{
    background-color: #1ebf1e;
    color: #fcfcfc;
    font-weight: bold;
    font-size: large;
  }
  .action{
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  .search{
    width: 300px;
  }
  .modal-body{
    background-color: #eee3e3;

  }
  .allPart{
    margin: 25px;

  }
  .firstPart{
    display: flex;
    justify-content: space-between;
  }
  .secondPart{
    margin: 25px 0px;
    display: flex;
    justify-content: space-between;
  }
  .thirdPart{
    display: flex;
  }
</style>