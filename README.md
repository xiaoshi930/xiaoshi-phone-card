# 消逝卡(手机端)
## 配置资源文件
~~~ 
- url: /hacsfiles/xiaoshi-phone-card/xiaoshi-phone-card.js
  type: module
~~~

## 功能1：空调卡片
**引用示例**
~~~
type: custom:xiaoshi-phone-climate-card
entity: climate.kongtiao_keting
temperature: sensor.woshi_wendu              ## 额外温度实体，覆盖空调当前温度，用于空调实体没有【当前温度】情况
timer: timer.ke_ting_kong_diao_ding_shi_qi   ## 辅助元素：定时器实体
theme: on                                    ## 可选on、off、或者函数返回值如'[[[ return theme() ]]]'
auto_show: false                             ## 当有此选项时，空调关闭时，卡片隐藏
width: 100%                                  ## 卡片宽度，可省略，默认100%
buttons:                                     ## 附加按钮：辅热、节能、干燥、睡眠、提示音、指示灯等，没有可省略
  - switch.kongtiao_dryer_keting             ## 没有可省略
  - switch.kongtiao_eco_keting               ## 没有可省略
  - switch.kongtiao_heater_keting            ## 没有可省略
  - switch.kongtiao_sleep_keting             ## 没有可省略
  - switch.kongtiao_alarm_keting             ## 没有可省略
  - light.kongtiao_light_keting              ## 没有可省略
~~~

## 功能2：加湿器卡片
**引用示例**
~~~
type: custom:xiaoshi-phone-climate-card
entity: humidifier.jiashiqi_keting
select: select.jiashiqi_keting               ## 加湿器风机select实体
timer: timer.ke_ting_kong_diao_ding_shi_qi   ## 辅助元素：定时器实体
theme: on                                    ## 可选on、off、或者函数返回值如'[[[ return theme() ]]]'
auto_show: false                             ## 当有此选项时，空调关闭时，卡片隐藏
width: 100%                                  ## 卡片宽度，可省略，默认100%
buttons:                                     ## 附加按钮：辅热、节能、干燥、睡眠、提示音、指示灯等，没有可省略
  - light.jiashiqi_light_keting              ## 没有可省略
  - switch.jiashiqi_alarm_keting             ## 没有可省略
  - sensor.jiashiqi_water_keting             ## 没有可省略
  - sensor.jiashiqi_tank_keting              ## 没有可省略
~~~

## 功能3：电脑卡片
**引用示例**
~~~
type: custom:xiaoshi-phone-computer-card
entity: switch.diannao                       ## 电脑开关实体（来源开机卡）
theme: on                                    ## 可选on、off、或者函数返回值如'[[[ return theme() ]]]'
auto_show: false                             ## 当有此选项时，空调关闭时，卡片隐藏
cpu: sensor.pc_cpu_usage                     ## 实体来源：windows电脑安装 IOT link，配置HA的mqtt服务器
memory: sensor.pc_memory_usage               ## 实体来源：官网https://iotlink.gitlab.io/downloads.html
storage:
  - sensor.pc_storage_c_usage                ## 实体来源：同上
  - sensor.pc_storage_d_usage                ## 实体来源：同上
  - sensor.pc_storage_e_usage                ## 实体来源：同上
  - sensor.pc_storage_f_usage                ## 实体来源：同上
~~~

## 功能4：灯光控制卡
**引用示例**
~~~
type: custom:xiaoshi-phone-light-card
entities:             # 要想使用全关功能，灯光必须是light实体
  - light.light1
  - light.light2
  - light.light3    
width: 87vw           # 卡片宽度
height: 20vw          # 卡片高度
rgb: true             # 是否显示亮度、色温控制
show: auto            # 当有这行调用时，仅当灯光时on时才会显示，当灯光时off时卡片整体隐藏
theme: "on"           # 选项on是白色，选项off是黑色，也可以引用全局函数：'[[[ return theme()]]]'
total: "on"           # 选项on显示表头统计行，选项off不显示统计行，默认参数为on
columns: 1            # 布局的列数，默认1列
~~~

## 功能5：插座控制卡
**引用示例**
~~~
type: custom:xiaoshi-phone-switch-card
entities:
  - entity: switch.switch1   # 插座1实体 
    power: sensor.power1     # 插座1对应功率实体
  - entity: switch.switch2   # 插座2实体
    power: sensor.power2     # 插座2对应功率实体
height: 85vw                 # 卡片宽度
width: 20vw                  # 卡片高度
theme: "on"                  # 选项on是白色，选项off是黑色，也可以引用全局函数：'[[[ return theme()]]]'
total: "on"                  # 选项on显示表头统计行，选项off不显示统计行，默认参数为on
columns: 1                   # 布局的列数，默认1列
~~~

## 功能6：text输入框卡
**引用示例**
~~~
type: custom:xiaoshi-phone-text-card
entity: text.text1           # text实体
height: 56px                 # 卡片高度
width: 65vw                  # 卡片宽度
border-radius: 10px          # 圆角大小,默认值是10px
theme: "on"                  # 选项on是白色，选项off是黑色，也可以引用全局函数：'[[[ return theme()]]]'
~~~

## 功能7：加载随机视频网址API
**引用示例**
~~~
type: custom:xiaoshi-phone-video-card 
top: 0vh  # 上下偏移的距离
url:
  - https://videos.xxapi.cn/0db2ccb392531052.mp4 # 引用视频api网址的数组
  - https://videos.xxapi.cn/228f4dd7318750dd.mp4 # 引用视频api网址的数组
~~~

## 功能8：加载随机图片网址API
**引用示例**
~~~
type: custom:xiaoshi-phone-image-card
top: 0vh  # 上下偏移的距离
url:
  - https://api.suyanw.cn/api/sjmv.php  # 引用图片api网址的数组
  - https://api.suyanw.cn/api/meinv.php # 引用图片api网址的数组
~~~
