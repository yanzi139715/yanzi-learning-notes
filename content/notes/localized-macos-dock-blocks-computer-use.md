---
title: 中文 macOS 上，AI 电脑操控的点击被「程序坞」拦截
summary: 点哪里都提示会落在程序坞或通知中心上时，可以只把这两个系统组件的语言切成英文。
publishedAt: 2026-11-24
status: published
---

在简体中文 macOS 上，用 AI 编程工具的电脑操控功能（让 AI 模拟点击屏幕）时，无论点哪里都被拒绝，提示这次点击会落在「程序坞」上；处理完之后，又出现会落在「通知中心」上的提示。

## 原因

**事实**：程序坞和通知中心都有一层覆盖整个屏幕的透明窗口。

**推断（根据现象和解法反推，未看到工具源码）**：电脑操控工具在放行这类系统窗口时，按英文的进程名或窗口名（比如 `Dock`）匹配。中文系统里它显示为「程序坞」，没有被识别成系统窗口，于是被当成挡在目标前面的普通窗口拦了下来。

**实测**：只把程序坞的界面语言切成英文后，点击恢复正常；通知中心用同样的方法处理后也恢复了。

## 怎么做

只改这两个系统组件的语言，系统其他部分保持中文。

程序坞：

```bash
defaults write com.apple.dock AppleLanguages -array en && killall Dock
```

恢复中文：

```bash
defaults delete com.apple.dock AppleLanguages && killall Dock
```

通知中心：

```bash
defaults write com.apple.notificationcenterui AppleLanguages -array en && killall NotificationCenter
```

恢复中文：

```bash
defaults delete com.apple.notificationcenterui AppleLanguages && killall NotificationCenter
```

## 同时踩到的前置条件

- 在第三方终端里使用时，「辅助功能」和「屏幕录制」权限要授给真正发起请求的那个应用本身；屏幕录制权限改完，要重启这个应用才生效。
- 有些系统应用不认模拟出来的拖动操作（比如拖动排序），这类操作仍需要手动完成。

## 适用范围与失效条件

适用于非英文 macOS 上使用 AI 电脑操控（屏幕点击类工具）时，出现“点击会落在某个系统组件上”的拦截。

如果工具以后改为按应用标识（bundle id）识别系统窗口，就不再需要这个绕法。macOS 大版本更新后需要重新测试。
