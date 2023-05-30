# Shadertoy Kraken Monitor

This project is a web application that displays shaders from Shadertoy.com on NZXT Kraken using Web Integrations. It monitors the temperature of your computer's processing units, which are either a CPU or a GPU and overlays it over the shader.

The temperature gauge uses a normalized value between 0 and 100, representing the current temperature of the chosen processing unit. When the temperature changes, the gauge adjusts accordingly with a smooth animation.

## How to Use

By default, you'll see an introductory message with instructions.

To select a shader, you need to change the URL parameters. In the URL, locate shader=id and replace id with the identifier of the shader you'd like to view. You can find shaders on [Shadertoy](https://www.shadertoy.com/).

To select a processing unit for temperature monitoring, locate processor=gpu or cpu in the URL and replace gpu or cpu with your chosen processing unit.

```
npx serve
```
