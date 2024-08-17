import { SvgChart, SVGRenderer } from '@wuba/react-native-echarts';
import * as echarts from 'echarts/core';
import { useRef, useEffect, useState } from 'react';
import {
    BarChart,
} from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
} from 'echarts/components';
import { Dimensions, StyleSheet, View } from 'react-native';
import axios from 'axios';

// 注册扩展组件
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    SVGRenderer,
    BarChart,
]);

const { width, height } = Dimensions.get('window');
const E_HEIGHT = height * 0.95; // 100vh
const E_WIDTH = width;   // 100vw

function ChartComponent({ option }: { option: any }) {
    const chartRef = useRef<any>(null);

    useEffect(() => {
        let chart: any;
        if (chartRef.current) {
            chart = echarts.init(chartRef.current, 'light', {
                renderer: 'svg',
                width: E_WIDTH,
                height: E_HEIGHT,
            });
            chart.setOption(option);
        }
        return () => chart?.dispose();
    }, [option]);

    return <SvgChart ref={chartRef} style={{ width: E_WIDTH, height: E_HEIGHT }} />;
}

// 配置数据
function slice_reverse_arr(data: Record<string, any>): any[] {
    let obj = addProgram(data);
    const entries = Object.entries(obj);

    // 对 entries 进行排序并倒序切片
    entries.sort(([, valueA], [, valueB]) => (valueA as any) - (valueB as any));
    let reverseArr = entries.reverse().slice(2);
    let other = ["其他", 0];

    // 使用递归处理 reverseArr
    const processEntries = (arr: any[], index: number, result: any[]): any[] => {
        if (index >= arr.length) {
            result.push(other);
            return result.reverse();
        }

        const [key, value] = arr[index];
        if (value > 100) {
            if (data[key].program) {
                let _other = ["其他", 0];
                let _XA = [];

                // 递归处理 program 数据
                const programEntries = Object.entries(data[key].program);
                programEntries.forEach(([programKey, programValue]) => {
                    if (programValue as any > 10) {
                        _XA.push([programKey, programValue]);
                    } else {
                        _other[1] += programValue as any;
                    }
                });

                _XA.push(_other);
                _XA.sort((a, b) => a[1] as number - (b[1] as number));

                result.push([key, value, _XA]);
            } else {
                result.push([key, value]);
            }
        } else {
            other[1] += value;
        }

        return processEntries(arr, index + 1, result);
    };

    return processEntries(reverseArr, 0, []);
}

function addProgram(data: any) {
    // 处理嵌套的 program 数据
    const processedData = {};
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            if (typeof data[key] === "object" && data[key].program) {
                // 累加 program 对象中的数值
                const programData = data[key].program;
                // @ts-ignore
                const total = Object.values(programData).reduce((sum, value) => sum + value, 0);
                // @ts-ignore
                processedData[key] = total;
            } else {
                // @ts-ignore
                processedData[key] = data[key];
            }
        }
    }
    return processedData;
}

function setProgramKey(key: string){
    switch (key) {
        case "Google Chrome":
            return "浏览器"
            break;
        case "Windows 默认锁屏界面":
            return "锁屏"
            break;
        default:
            return key
            break;
    }
    return key
}

export default function App() {
    const [option, setOption] = useState({
        title: {
            text: `已使用 10 分钟\n超时限制 10分钟`,
            left: "center",
        },
        grid: {
            left: "20%", // 设置左侧文字的宽度
          },
        yAxis: {
            type: 'category',
            data: ["QQ", "Chrome", "其他"],
            axisLabel: {
                fontSize: 14 // 直接在 axisLabel 中设置字体大小
            }
        },
        xAxis: {
            type: 'value',
            axisLabel: {
                fontSize: 14 // 直接在 axisLabel 中设置字体大小
            }
        },
        series: [
            {
                data: [120, 200, 150],
                type: 'bar'
            }
        ]
    });

    // 如果需要动态更新 option，你可以在此处调用 setOption
    useEffect(() => {
        axios.get("http://time.xianyi.it/getTime").then((res) => {
            let data = res.data.data
            let XA = slice_reverse_arr(res.data.data)
            //console.log(res.data.data);

            //console.log(data);

            let newOption = {
                title: {
                    text: `已使用 ${((data.all - data.Limit) / 60).toFixed()}分钟\n超时限制${data.Limit / 60}分钟`,
                    left: "center",
                },
                grid: {
                    left: "20%", // 设置左侧文字的宽度
                  },
                yAxis: {
                    data: XA.map((item) => setProgramKey(String(item[0]))),
                    axisLabel: {
                        fontSize: 14 // 直接在 axisLabel 中设置字体大小
                    }
                },
                tooltip: {
                    trigger: "axis", // 或者 'item'，根据实际需求选择
                    axisPointer: {
                        type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
                    },
                    //@ts-ignore
                    formatter: function (params) {
                        var param = params[0];
                        return param.name + ": " + param.value;
                    },
                },
                xAxis: {
                    axisLabel: {
                        fontSize: 14 // 直接在 axisLabel 中设置字体大小
                    }
                },
                dataGroupId: "",
                animationDurationUpdate: 500,
                series: {
                    type: "bar",
                    id: "sales",
                    data: XA.map((item) => {
                        return { value: item[1], groupId: item[0] };
                    }),

                    universalTransition: {
                        enabled: true,
                        divideShape: "clone",
                    },
                },
                label: {
                    show: true,
                    position: "right", // 在柱状图的右侧显示
                    formatter: "{c}秒", // '{c}' 代表当前数据的值
                },
            };

            //@ts-ignore
            setOption(newOption)

        })
    }, [])

    return (
        <View style={styles.container}>
            <ChartComponent option={option} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {

    },
});
