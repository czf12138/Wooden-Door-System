<template>
  <div class="app-container">
    <!--卡片试图区域-->
    <el-card class="card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            placeholder="请输入地磅编号/名称查询"
            v-model="queryinfo.SearchKeyContent"
            @change="query"
            clearable
            @clear="query">
            <el-button slot="append" icon="el-icon-search" @click="query"></el-button>
          </el-input>
        </el-col>
        <!-- 添加地磅信息按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加地磅信息</el-button>
        </el-col>
      </el-row>
      <el-table :data="sendoilplacelist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="地磅名称" prop="name"></el-table-column>
        <el-table-column label="地磅编号" prop="code"></el-table-column>
        <el-table-column label="段码" prop="zoneCode"></el-table-column>
        <el-table-column label="是否启用" prop="enabled">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="enabledChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!--查看按钮-->
            <el-tooltip
              class="item"
              effect="dark"
              content="查看详情"
              placement="top"
              :enterable="false"
            >
              <el-button type="success" icon="el-icon-check" circle @click="placeDetail(scope.row)"></el-button>
            </el-tooltip>

            <!--编辑按钮-->
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="showEditDialog(scope.row)"
              ></el-button>
            </el-tooltip>

            <!--删除按钮-->
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="removeFormInfo(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.startIndex"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryinfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>

      <!-- 查看地磅信息对话框 -->
      <el-dialog title="地磅详情" :visible.sync="checkDialogVisible" width="50%">
        <!--内容主题区域-->
        <!-- 地磅名称:{{OnePlace.name}}  地磅编号:{{OnePlace.code}} 
        排序:{{OnePlace.sort}}  段码:{{OnePlace.zoneCode}}-->
        <el-form ref="form" :model="OnePlace" label-width="80px" size="mini">
          <el-row>
            <el-col :span="12">
              <el-form-item label="地磅名称:">{{OnePlace.name}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地磅编号:">{{OnePlace.code}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序:">{{OnePlace.sort}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="段码:">{{OnePlace.zoneCode}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="启用:">
                <el-switch
                  v-model="OnePlace.enabled"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="总线控制:">
                <el-switch
                  v-model="OnePlace.isCanBus"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="终端IP:">{{OnePlace.canBusAddr}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="终端端口:">{{OnePlace.canBusPort}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注:">{{OnePlace.memo}}</el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="checkDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="checkDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 添加地磅信息对话框 -->
      <el-dialog
        title="添加地磅信息"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed()">
        <el-form
          ref="addFormRef"
          :model="addForm"
          :rules="FormRules"
          label-width="100px"
          size="mini"
        >
          <el-row>
            <el-col :span="11" inline="true">
              <el-form-item label="地磅名称" prop="name">
                <el-input v-model="addForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="地磅编号" prop="code">
                <el-input v-model="addForm.code"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="排序:" prop="sort">
                <el-input-number v-model="addForm.sort" :min="1" :max="100"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="段码:" prop="zoneCode">
                <el-input-number v-model="addForm.zoneCode" :min="1" :max="100"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="启用:">
                <el-switch
                  v-model="addForm.enabled"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="总线控制:">
                <el-switch
                  v-model="addForm.isCanBus"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="终端IP:" prop="canBusAddr">
                <el-input v-model="addForm.canBusAddr"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="终端端口:" prop="canBusPort">
                <el-input v-model="addForm.canBusPort"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="备注:">
                <el-input type="textarea" v-model="addForm.memo"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addFormInfo()">确 定</el-button>
        </span>
       </el-dialog>
      
      <!-- 编辑菜单内容 -->
      <el-dialog title="修改地磅信息" :visible.sync="editDialogVisible" width="50%">
        <el-form
          label-width="100px"
          :model="OnePlace"
          size="mini"
          :rules="FormRules"
          ref="editFormRef"
        >
          <el-row>
            <el-col :span="11" inline="true">
              <el-form-item label="地磅名称:" prop="name">
                <el-input v-model="OnePlace.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="地磅编号:" prop="code">
                <el-input v-model="OnePlace.code"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="排序:" prop="sort">
                <el-input-number v-model="OnePlace.sort" :min="1" :max="100"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="段码:" prop="zoneCode">
                <el-input-number v-model="OnePlace.zoneCode" :min="1" :max="100"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="启用:">
                <el-switch
                  v-model="OnePlace.enabled"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="总线控制:">
                <el-switch
                  v-model="OnePlace.isCanBus"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="终端IP:" prop="canBusAddr">
                <el-input v-model="OnePlace.canBusAddr"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="终端端口:" prop="canBusPort">
                <el-input v-model="OnePlace.canBusPort"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="备注:">
                <el-input type="textarea" v-model="OnePlace.memo"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editFormInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import qs from 'qs'
import store from '@/store'
export default {
  data() {
    var checkName = (rule, value, callback) => {
      const regName = /^[\u4e00-\u9fa5]+$/;
      if (regName.test(value)) {
        return callback();
      }
      callback(new Error("请输入文字"));
    };

    var checkCode = (rule, value, callback) => {
      const regCode = /^\d+$|^\d+[.]?\d+$/;
      if (regCode.test(value)) {
        return callback();
      }
      callback(new Error("请输入数字编号"));
    };

    var checkIp = (rule, value, callback) => {
      const regIp = /^(\d{2,3}\.){3}\d{2,3}$/;
      if (regIp.test(value)) {
        return callback();
      }
      callback(new Error("请输入正确的终端IP格式"));
    };

    var checkPort = (rule, value, callback) => {
      const regPort = /^\d{3,4}$/;
      if (regPort.test(value)) {
        return callback();
      }
      callback(new Error("请输入正确的端口号"));
    };

    return {
      //获取用户列表的参数对象
      queryinfo: {
        BySearchKeyContent: true,
        SearchKeyContent: 1,
        //当前页数
        startIndex: 1,
        //当前每页显示数据数
        pageSize: 5
      },
      sendoilplacelist: [],
      totalCount: 1,
      //控制查看单地磅信息对话框的显示与隐藏
      addDialogVisible: false,
      //存放添加的地磅信息
      addForm: {
        name: '',
        code: '',
        zoneCode: '',
        sort: '',
        enabled: '',
        isCanBus: '',
        canBusAddr: '',
        canBusPort: '',
        memo: ''
      },
      //控制查看单地磅信息对话框的显示与隐藏
      checkDialogVisible: false,
      OnePlace: {},
      editDialogVisible: false,
      FormRules: {
        name: [
          { required: true, message: "请输入地磅名称", trigger: "blur" },
          { min: 1, max: 8, message: "长度在 1 到 8 个字符", trigger: "blur" },
          { validator: checkName, trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入地磅编号", trigger: "blur" },
          {
            min: 1,
            max: 13,
            message: "长度在 1 到 13 个字符",
            trigger: "blur"
          },
          { validator: checkCode, trigger: "blur" }
        ],
        canBusAddr: [
          { required: true, message: "请输入终端IP", trigger: "blur" },
          { validator: checkIp, trigger: "blur" }
        ],
        canBusPort: [
          { required: true, message: "请输入终端端口号", trigger: "blur" },
          { validator: checkPort, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getsendoilplacelist();
  },
  methods: {
    getsendoilplacelist() {
      this.$axios
        .get("api/SendOilPlace/GetByPage", {
          params: this.queryinfo
        })
        .then(res => {
          if (res.status !== 200) {
            return this.$message.error("获取地磅列表失败！");
          }
          this.sendoilplacelist = res.data.data.entities;
          this.totalCount = res.data.data.totalCount;

          console.log("data", res);
        });
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryinfo.pageSize = newSize;
      this.getsendoilplacelist();
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryinfo.startIndex = newPage;
      this.getsendoilplacelist();
    },
    query() {
      this.getsendoilplacelist();
    },
    //监听switch开关状态改变
    enabledChanged(placeinfo) {
      // this.$axios.put(`http://119.29.141.30:8088/api/SendOilPlace/${placeinfo.code}`,placeinfo.enabled)  单项数据修改形式待定
    },
    placeDetail(place) {
      this.checkDialogVisible = true;
      this.OnePlace = place;
      console.log(place.code);
      console.log(this.OnePlace);
    },
    showEditDialog(place) {
      this.editDialogVisible = true;
      this.OnePlace = place;
      console.log(place.code);
      console.log(this.Oneplace);
    },
    //编辑地磅详情
    editFormInfo() {
      const params = {
        Code: this.OnePlace.code,
        Name: this.OnePlace.name,
        Enabled:this.OnePlace.enabled,
        Sort:this.OnePlace.sort,
        ZoneCode:this.OnePlace.zoneCode,
        IsCanBus:this.OnePlace.isCanBus,
        CanBusAddr:this.OnePlace.canBusAddr,
        CanBusPort:this.OnePlace.canBusPort,
        Memo:this.OnePlace.memo
      }
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return;
        //通过qs序列化将请求参数转换为A&B
        this.$axios.put(`api/SendOilPlace/${this.OnePlace.id}`,qs.stringify(params))
        .then(res=>{
          console.log("res",res)
          if(res.status!==200){
            this.$message.error("更新地磅失败！")
          } 
          else{
          // this.$axios.put(`http://119.29.141.30:8088/api/SendOilPlace/${this.OnePlace.id}`,{param:this.OnePlace})
          this.editDialogVisible = false;
          this.getsendoilplacelist();
          this.$message.success("更新地磅成功！");
          }
        });
      })
    },
    //监听添加地磅信息对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    //点击按钮，添加地磅信息
    addFormInfo() {
      const params = {
        Code: this.addForm.code,
        Name: this.addForm.name,
        Enabled: this.addForm.enabled,
        Sort: this.addForm.sort,
        ZoneCode: this.addForm.zoneCode,
        IsCanBus: this.addForm.isCanBus,
        CanBusAddr: this.addForm.canBusAddr,
        CanBusPort: this.addForm.canBusPort,
        Memo: this.addForm.memo
      }
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return;
        //可以发起添加地磅信息的网络请求
        this.$axios.post(`api/SendOilPlace`,qs.stringify(params))
          .then(res => {
            if (res.status !== 200) {
              this.$message.error('添加地磅信息失败！')
            }
            else{
              this.addDialogVisible = false
              this.getsendoilplacelist()
              this.$message.success('添加地磅信息成功！')
            }
            console.log('res', res)
          })
      })
    },
    //删除单台磅信息
    removeFormInfo(place) {
        this.$axios.delete(`api/SendOilPlace/${place.id}`,{params:{operateUser:store.getters.name}})
          .then(res => {
            if (res.status !== 200) {
              this.$message.error('删除地磅失败！')
            } else {
              this.getsendoilplacelist()
              this.$message.success('删除地磅成功！')
            }
          })
    }
  }
};
</script>

<style >
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
  font-size: 12px;
}
</style>>
