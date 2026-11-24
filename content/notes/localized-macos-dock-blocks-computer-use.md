---
title: 中文 Mac 上，让 AI 点屏幕总被「程序坞」挡住
summary: 只把程序坞和通知中心的语言改成英文，点击就正常了，系统其他地方还是中文。
publishedAt: 2026-11-06
status: published
---

在中文 macOS 上，用 AI 编程工具的电脑操控功能（让 AI 帮你点屏幕）时，不管点哪里都被拒绝，提示这次点击会落在「程序坞」上。解决之后，又提示会落在「通知中心」上。

## 原因

程序坞和通知中心各有一层盖住整个屏幕的透明窗口。

我们的猜测是：这个工具会放行系统自己的窗口，但它是按英文名字（比如 `Dock`）来认的。中文系统里名字变成了「程序坞」，工具认不出来，就当成挡在前面的普通窗口拦下了。工具源码没有看到，这只是根据现象和解法推出来的。

实际测试：把程序坞的语言单独改成英文后，点击恢复正常；通知中心同样处理后也好了。

## 怎么做

只改这两个组件，系统其他地方不受影响。

程序坞改英文：

```bash
defaults write com.apple.dock AppleLanguages -array en && killall Dock
```

改回中文：

```bash
defaults delete com.apple.dock AppleLanguages && killall Dock
```

通知中心改英文：

```bash
defaults write com.apple.notificationcenterui AppleLanguages -array en && killall NotificationCenter
```

改回中文：

```bash
defaults delete com.apple.notificationcenterui AppleLanguages && killall NotificationCenter
```

## 顺便遇到的两件事

- 在第三方终端里用的话，「辅助功能」和「屏幕录制」权限要给真正发起操作的那个应用。屏幕录制权限改完，要重启这个应用才生效。
- 有些系统应用不接受模拟的拖动（比如拖动排序），这种还得自己动手。

## 适用情况

适合非英文 macOS 上用 AI 操控屏幕时，提示“点击会落在某个系统组件上”的情况。

如果工具以后改成按应用的唯一标识来认系统窗口，就不用这么绕了。macOS 大版本更新后要重新试一下。
