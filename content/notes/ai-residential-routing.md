---
title: 让多个 AI 服务共用住宅出口，同时保留日常网络速度
summary: 一次 Clash Verge 分流实战：用住宅 Hysteria2 保持 AI 出口一致，用 TUIC5 承担其他海外流量。
publishedAt: 2026-07-31
status: published
---

同一个账号，在美国真实网络上能得到预期的 Pro 表现；换到两条机房代理后，请求虽然能完成，却经常直接“秒答”，表现像是被分配到了更轻的处理路径。换成美国住宅出口后，这个现象没有再出现，但最初的住宅 VLESS 又慢得几乎不可用。

这次排查最终解决了两个不同的问题：AI 服务需要稳定的住宅出口身份，日常网络又不应该全部被慢线路拖住。最后采用的结构是：OpenAI、Claude、Gemini 固定走住宅 Hysteria2，中国网络直连，其他海外流量走低延迟 TUIC5。

## 实测事实

为了只比较协议性能，住宅 VLESS 和住宅 Hysteria2 使用了相同的出口指纹。结果差距很大：

| 路径 | 交互延迟 | 下载表现 |
| --- | ---: | ---: |
| 住宅 VLESS | ChatGPT 公共端点中位约 1.536 秒 | 5 MB 连续三次到 20 秒上限，约 34 KB/s |
| 住宅 Hysteria2 | ChatGPT 公共端点中位约 0.614 秒 | 5 MB 中位约 3.0 MB/s |

住宅 Hysteria2 的最终稳定性复测共 38 次请求，网络失败为 0；10 MB 下载中位约 2.16 秒，也就是约 4.63 MB/s。协议切换前后的出口指纹一致，因此速度提升不是“偷偷换了另一个 IP”造成的。

完成分流并清掉旧长连接后，实时连接表显示：

- ChatGPT、Claude、Gemini 的新连接都命中住宅 Hysteria2。
- 普通海外下载命中 TUIC5。
- 27 次公共端点复测没有网络失败。
- ChatGPT、Claude、Gemini 公共端点的响应中位分别约为 0.432、0.438、0.816 秒；TUIC5 下载约 1.3 MB/s。

这些数据证明的是网络路径、握手和公共响应，不是登录状态下的模型推理速度基准。

## 合理推断

“机房出口出现秒答、住宅出口恢复预期表现”是可以重复观察的现象，但它不能证明平台官方按某个 IP 做了风控。也可能是地区、出口信誉、容量调度、会话状态或其他没有公开的信号共同作用。

因此更准确的结论是：在这组设备、账号和时间条件下，住宅出口与预期的 Pro 表现稳定相关；具体平台机制未知。不要把经验写成“已经确认某家公司封了某个 IP”。

## 最终分流结构

```text
OpenAI / Claude / Gemini ──> 住宅 Hysteria2
中国 IP 与局域网          ──> DIRECT
其他海外流量              ──> TUIC5
```

关键不是在 Clash Verge 面板里临时点一次节点，而是把代理和规则写进持久增强配置。订阅刷新后，增强规则仍会重新合并，才不会隔天悄悄失效。

下面是完全使用占位信息的 Mihomo 示例，只展示结构，不能直接连接：

```yaml
proxies:
  - name: Home-Residential-Hysteria2
    type: hysteria2
    server: home.example.com
    port: 443
    password: CHANGE_ME
    sni: home.example.com

  - name: Fast-TUIC5
    type: tuic
    server: fast.example.com
    port: 443
    uuid: 00000000-0000-0000-0000-000000000000
    password: CHANGE_ME
    alpn:
      - h3

rules:
  - DOMAIN-SUFFIX,openai.com,Home-Residential-Hysteria2
  - DOMAIN-SUFFIX,chatgpt.com,Home-Residential-Hysteria2
  - DOMAIN-SUFFIX,oaistatic.com,Home-Residential-Hysteria2
  - DOMAIN-SUFFIX,oaiusercontent.com,Home-Residential-Hysteria2
  - DOMAIN-SUFFIX,anthropic.com,Home-Residential-Hysteria2
  - DOMAIN-SUFFIX,claude.ai,Home-Residential-Hysteria2
  - DOMAIN-SUFFIX,claude.com,Home-Residential-Hysteria2
  - DOMAIN-SUFFIX,googleapis.com,Home-Residential-Hysteria2
  - DOMAIN-SUFFIX,google.com,Home-Residential-Hysteria2
  - DOMAIN-SUFFIX,gstatic.com,Home-Residential-Hysteria2
  - DOMAIN-SUFFIX,googleusercontent.com,Home-Residential-Hysteria2
  - DOMAIN-SUFFIX,google.dev,Home-Residential-Hysteria2
  - GEOIP,LAN,DIRECT
  - GEOIP,CN,DIRECT
  - MATCH,Fast-TUIC5
```

Gemini 相关请求分散在较多 Google 域名。使用上面这种宽规则更省心，但代价是 Google 搜索、Gmail 等流量也会经过住宅线路。若要收窄，必须重新验证登录、附件、生成内容和长连接，而不能只验证首页能打开。

## 验证顺序

1. 先确认两个住宅协议的出口指纹相同，再比较延迟、连续下载和失败率。
2. 写入持久增强规则并重新加载配置。
3. 清掉旧连接，分别打开 ChatGPT、Claude、Gemini，再看新连接实际命中了哪个代理。
4. 用一个不属于 AI 域名的海外下载验证 TUIC5，避免所有流量仍误走住宅线路。
5. 刷新一次订阅后再复测，确认增强规则不会消失。
6. 改动前保留配置备份；异常时恢复备份并重新加载。

协议排名不是永久结论。服务器负载、运营商线路和产品域名都会变化，后续应该用同样的方法复测，而不是把一次测速当作信仰。

## 隐私边界

公开记录保留方法、规则结构和统计结果，但不应包含订阅地址、服务器地址、端口、真实 UUID、密码、证书、出口 IP、Clash profile 标识、本机路径、账号信息或认证请求内容。

示例中的域名、密码和 UUID 都是占位符。任何从私人配置整理出来的公开文章，都应另写一份脱敏稿，而不是让博客在构建时读取私人仓库。
