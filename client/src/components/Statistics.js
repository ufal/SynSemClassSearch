import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './styles/Statistics.css';
import { useLocation } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ChartDataLabels);

const Statistics = () => {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const versionFromURL = urlParams.get('version');
    const selectedVersion = versionFromURL || 'synsemclass5.0';

    const [stats, setStats] = useState({
        uniqueCommonClassCount: 0,
        uniqueCommonIdCount: 0,
        totalClassMembers: 0,
        langCounts: {}
    });
    const [isLoading, setIsLoading] = useState(true);
    // const selectedVersion = location.state?.selectedVersion || 'synsemclass5.0';

    const version = selectedVersion === 'synsemclass5.0' ? 'SynSemClass5.0' : 'SynSemClass4.0';

    const languageMap = {
        eng: 'English',
        cz: 'Czech',
        deu: 'German',
        spa: 'Spanish'
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/search`, {
                    params: {
                        lemma: '',
                        idRef: '',
                        classID: '.*',
                        cmnote: '',
                        restrict: '',
                        filters: [],
                        roles_cnf: null,
                        version: selectedVersion,
                        restrictRolesSearch: false
                    },
                });

                setStats({
                    uniqueCommonClassCount: response.data.uniqueCommonClassCount,
                    uniqueCommonIdCount: response.data.uniqueCommonIdCount,
                    totalClassMembers: response.data.totalClassMembers,
                    langCounts: response.data.langCounts
                });
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
            setIsLoading(false);
        };

        fetchData();
    }, []);

    const pieChartData = {
        labels: Object.keys(stats.langCounts).map(key => languageMap[key]),
        datasets: [{
            data: Object.values(stats.langCounts).map(item => item.classMembers),
            backgroundColor: ['#a63232', '#2d5986', '#672d86', '#2d8673'], 
            hoverOffset: 4,
            cutout: '40%'
        }]
    };

    // Prepare data for Bar Chart
    const barChartData = {
        labels: Object.keys(stats.langCounts).map(key => languageMap[key]),
        datasets: [{
            label: 'Unique Classes',
            data: Object.values(stats.langCounts).map(item => item.commonClasses),
            backgroundColor: ['#a63232', '#2d5986', '#672d86', '#2d8673'],
        }]
    };

    // Options for the Pie chart
    const pieChartOptions = {
        plugins: {
            legend: {
                display: false
            },
            datalabels: {
                color: '#fff',
                formatter: (value, ctx) => {
                    return ctx.chart.data.labels[ctx.dataIndex] + '\n(' + value + ')';
                },
                font: {
                    weight: 'bold',
                    size: 14
                },
            },
            tooltip: {
                enabled: false
            }
        }
    };

    // Options for the Bar chart
    const barChartOptions = {
        plugins: {
            legend: {
                display: false
            },
            datalabels: {
                color: '#fff',
                formatter: (value, ctx) => {
                    return ctx.chart.data.labels[ctx.dataIndex] + '\n(' + value + ')';
                },
                font: {
                    weight: 'bold',
                    size: 14
                },
            },
            tooltip: {
                enabled: false
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                grid: {
                    display: false
                },
                beginAtZero: true
            }
        }
    };

    if (isLoading) {
        return <div>Loading statistics...</div>;
    }

    return (
        <div className="statistics-container">
            <h2>Ontology Statistics ({version})</h2>
            <p>{stats.totalClassMembers} total class members in {stats.uniqueCommonIdCount} unique classes.</p>
            <div className="charts-container">
                <div className="chart-section">
                    <h3>Class Members Distribution</h3>
                    <Pie data={pieChartData} options={pieChartOptions} size={350}/>
                </div>
                <div className="chart-section bar-chart">
                    <h3>Classes by Language</h3>
                    <Bar data={barChartData} options={barChartOptions} height={300}/>
                </div>
            </div>
        </div>
    );
    };

export default Statistics;