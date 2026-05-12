'use client';

import React, { useState, useEffect, useRef } from 'react';
import NameplateEngine from '@/lib/NameplateEngine';

const SIZES = {
    '15x16': { label: '15" x 16" (L)', width: 750, height: 800, category: 'L' },
    '15x10': { label: '15" x 10" (S)', width: 900, height: 600, category: 'S' },
    '12x8': { label: '12" x 8" (S)', width: 900, height: 600, category: 'S' }
};

const THEMES = {
    'black-gold': { label: 'Black + Gold', bg: '#1a1a1a', fg: '#c5a059', muted: '#a3844a' },
    'white-gold': { label: 'White + Gold', bg: '#ffffff', fg: '#c5a059', muted: '#a3844a' },
    'silver-black': { label: 'Silver + Black', bg: '#cfd2d6', fg: '#111111', muted: '#444444' }
};

const LOGO_PRESETS = {
    sikh: ["Khanda_1", "EkOnkar_1", "Khanda_1"],
    hindu: ["Swastik_1", "GaneshJi_1", "Swastik_1"],
    om: ["Om_1"],
    ekonkar: ["EkOnkar_1"],
    none: []
};

const profiles = [
    {
        name: "Traditional",
        main: "GreatVibes-Regular",
        sub: "Schadow BT Roman",
        border: "1",
        logos: LOGO_PRESETS.sikh,
        nameMax: 92
    },
    {
        name: "Modern Bold",
        main: "avalonb",
        sub: "ARIALUNI",
        border: "2",
        logos: LOGO_PRESETS.om,
        nameMax: 68
    },
    {
        name: "Script Classic",
        main: "aristonb",
        sub: "cgtime",
        border: "4",
        logos: LOGO_PRESETS.hindu,
        nameMax: 76
    },
    {
        name: "Minimalist",
        main: "Schadow BT Bold",
        sub: "ARIALUNI",
        border: "5",
        logos: LOGO_PRESETS.ekonkar,
        nameMax: 64
    },
    {
        name: "Royal",
        main: "RECHTMAN",
        sub: "cgtimeb",
        border: "7",
        logos: ["Swastik_2", "Om_2", "Swastik_2"],
        nameMax: 76
    },
    {
        name: "Soft Cursive",
        main: "Lemon Jelly Personal Use",
        sub: "Schadow BT Roman",
        border: "10",
        logos: [],
        nameMax: 86
    }
];

export default function NameplateDesigner() {
    const [formData, setFormData] = useState({
        mainName: 'Saini Niwas',
        address: '#13 Model Town',
        bottomLine: '',
        logoMode: 'auto',
        borderMode: 'auto',
        plateSize: '15x10',
        colorTheme: 'black-gold'
    });
    const [status, setStatus] = useState('Initializing...');
    const [isError, setIsError] = useState(false);
    const [trigger, setTrigger] = useState(0);
    const [fabric, setFabric] = useState(null);
    const [fontsReady, setFontsReady] = useState(false);
    const [fontStatus, setFontStatus] = useState({});

    useEffect(() => {
        const patchFabric = (f) => {
            if (!f) return;
            const classes = ['Text', 'IText', 'Textbox'];
            classes.forEach(cls => {
                if (f[cls]) {
                    f[cls].prototype.textBaseline = 'alphabetic';
                    if (f[cls].prototype.cacheProperties && !f[cls].prototype.cacheProperties.includes('textBaseline')) {
                        f[cls].prototype.cacheProperties.push('textBaseline');
                    }
                }
            });
        };

        import('fabric').then(module => {
            const f = module.fabric || module;
            patchFabric(f);
            setFabric(f);
            setStatus('Engine loaded.');
        }).catch(err => {
            console.error('Fabric load failure:', err);
            setStatus('Failed to load Fabric.js');
            setIsError(true);
        });

        loadAllFonts(setFontStatus).then(() => {
            setFontsReady(true);
        });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setTrigger(t => t + 1);
    };

    const handleSample = () => {
        setFormData({
            mainName: 'Saini Niwas',
            address: '#13 Model Town',
            bottomLine: '',
            logoMode: 'auto',
            borderMode: 'auto',
            plateSize: '15x10',
            colorTheme: 'black-gold'
        });
        setTrigger(t => t + 1);
    };

    if (!fabric) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-50 p-10 text-center">
                <div className="max-w-md">
                    <h2 className="text-xl font-bold mb-2">Initializing Designer</h2>
                    <p className="text-muted">{status}</p>
                </div>
            </div>
        );
    }

    const failedFonts = Object.entries(fontStatus).filter(([_, status]) => status === 'failed').map(([name]) => name);

    return (
        <main className="max-w-[1180px] mx-auto p-6 md:p-9">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                <div>
                    <h1 className="text-2xl font-bold">Nameplate Designer Engine</h1>
                </div>
                <div className="flex flex-col items-end">
                    <div className={`text-sm text-right ${isError ? 'text-warn' : 'text-muted'}`}>
                        {status}
                    </div>
                    {failedFonts.length > 0 && (
                        <div className="text-[10px] text-warn max-w-[300px] text-right mt-1 opacity-80">
                            Warning: Some fonts ({failedFonts.join(', ')}) failed to load due to format errors. Fallbacks will be used.
                        </div>
                    )}
                </div>
            </header>

            <form className="controls" onSubmit={handleSubmit}>
                <label className="span-3">
                    Main name
                    <input 
                        name="mainName" 
                        value={formData.mainName} 
                        onChange={handleInputChange}
                        maxLength="42" 
                        required 
                    />
                </label>
                <label className="span-3">
                    Address line
                    <input 
                        name="address" 
                        value={formData.address} 
                        onChange={handleInputChange}
                        maxLength="56" 
                    />
                </label>
                <label className="span-3">
                    Lower line
                    <input 
                        name="bottomLine" 
                        value={formData.bottomLine} 
                        onChange={handleInputChange}
                        placeholder="Optional" 
                        maxLength="44" 
                    />
                </label>
                <label className="span-3">
                    Symbol set
                    <select name="logoMode" value={formData.logoMode} onChange={handleInputChange}>
                        <option value="auto">Auto varied</option>
                        <option value="sikh">Khanda + Ek Onkar</option>
                        <option value="hindu">Swastik + Ganesh</option>
                        <option value="om">Om only</option>
                        <option value="ekonkar">Ek Onkar only</option>
                        <option value="none">No symbol</option>
                    </select>
                </label>
                <label className="span-3">
                    Color Theme
                    <select name="colorTheme" value={formData.colorTheme} onChange={handleInputChange}>
                        {Object.entries(THEMES).map(([key, info]) => (
                            <option key={key} value={key}>{info.label}</option>
                        ))}
                    </select>
                </label>
                <label className="span-3">
                    Plate Size
                    <select name="plateSize" value={formData.plateSize} onChange={handleInputChange}>
                        {Object.entries(SIZES).map(([key, info]) => (
                            <option key={key} value={key}>{info.label}</option>
                        ))}
                    </select>
                </label>
                <label className="span-3">
                    Border
                    <select name="borderMode" value={formData.borderMode} onChange={handleInputChange}>
                        <option value="auto">Auto varied</option>
                        <option value="1">Border 1</option>
                        <option value="2">Border 2</option>
                        <option value="4">Border 4</option>
                        <option value="5">Border 5</option>
                        <option value="7">Border 7</option>
                        <option value="10">Border 10</option>
                    </select>
                </label>
                <div className="actions span-3">
                    <button type="submit" className="btn">Generate</button>
                    <button type="button" className="btn btn-secondary" onClick={handleSample}>Sample</button>
                </div>
            </form>

            <section className="suggestion-grid" aria-live="polite">
                {profiles.map((profile, index) => (
                    <SuggestionCard 
                        key={`${index}-${trigger}-${formData.plateSize}-${formData.colorTheme}`}
                        profile={profile} 
                        data={formData} 
                        setStatus={setStatus}
                        setIsError={setIsError}
                        fabric={fabric}
                        ready={fontsReady}
                    />
                ))}
            </section>
        </main>
    );
}

function SuggestionCard({ profile, data, setStatus, setIsError, fabric, ready }) {
    const canvasRef = useRef(null);
    const fabricCanvasRef = useRef(null);
    const sizeConfig = SIZES[data.plateSize] || SIZES['15x10'];
    const themeConfig = THEMES[data.colorTheme] || THEMES['black-gold'];

    useEffect(() => {
        let isMounted = true;
        
        const initCanvas = async () => {
            if (!ready || !fabric || !canvasRef.current) return;

            // Small delay for DOM stability
            await new Promise(resolve => setTimeout(resolve, 60));
            
            if (!isMounted || !canvasRef.current) return;

            try {
                // Cleanup existing canvas if it exists on this element
                if (fabricCanvasRef.current) {
                    fabricCanvasRef.current.dispose();
                    fabricCanvasRef.current = null;
                }

                const canvas = new fabric.StaticCanvas(canvasRef.current, {
                    width: sizeConfig.width,
                    height: sizeConfig.height,
                    backgroundColor: themeConfig.bg,
                    enableRetinaScalar: false // Reduce complexity for preview
                });
                
                if (!isMounted) {
                    canvas.dispose();
                    return;
                }
                
                fabricCanvasRef.current = canvas;

                const baseBorderName = data.borderMode === 'auto' ? profile.border : data.borderMode;
                const borderName = `${baseBorderName}_${sizeConfig.category}`;
                const logoIds = resolveLogos(profile, data.logoMode);
                const engine = new NameplateEngine(sizeConfig.width, sizeConfig.height, { padding: 58 });
                const boxes = engine.getLayoutPlan({
                    logoCount: logoIds.length,
                    hasSubText: Boolean(data.address),
                    hasFooterText: Boolean(data.bottomLine)
                });

                await addBorder(canvas, borderName, fabric, sizeConfig, themeConfig);
                if (logoIds.length && boxes.logo) {
                    await addLogoGroup(canvas, logoIds, boxes.logo, fabric, themeConfig);
                }
                addText(canvas, engine, profile, data, boxes, fabric, themeConfig);
                
                if (isMounted && fabricCanvasRef.current === canvas) {
                    canvas.renderAll();
                    setStatus('Generated layout suggestions.');
                    setIsError(false);
                }
            } catch (err) {
                console.error('Canvas Init Error:', err);
                if (isMounted) {
                    setStatus(`Error: ${err.message}`, true);
                    setIsError(true);
                }
            }
        };

        initCanvas();

        return () => {
            isMounted = false;
            if (fabricCanvasRef.current) {
                try {
                    fabricCanvasRef.current.dispose();
                } catch (e) {
                    // Ignore errors during disposal
                }
                fabricCanvasRef.current = null;
            }
        };
    }, [profile, data, setStatus, setIsError, fabric, ready, sizeConfig, themeConfig]);

    return (
        <article className="suggestion-card">
            <header>
                <h2>{profile.name}</h2>
                <span className="meta">{profile.main}</span>
            </header>
            <div className="canvas-wrap">
                <canvas ref={canvasRef} />
            </div>
        </article>
    );
}

// Helper functions

async function loadAllFonts(setStatus) {
    if (typeof document === 'undefined' || !document.fonts) return;
    
    const families = new Set();
    profiles.forEach((profile) => {
        families.add(profile.main);
        families.add(profile.sub);
    });

    const statusMap = {};

    await Promise.all([...families].map(async (family) => {
        try {
            const isLoaded = document.fonts.check(`16px "${family}"`);
            if (isLoaded) {
                statusMap[family] = 'loaded';
                return;
            }

            await document.fonts.load(`16px "${family}"`);
            statusMap[family] = 'loaded';
        } catch (e) {
            statusMap[family] = 'failed';
        }
    }));
    
    setStatus(statusMap);
    
    try {
        await document.fonts.ready;
    } catch (e) {
        console.warn('document.fonts.ready failed', e);
    }
}

function resolveLogos(profile, logoMode) {
    if (logoMode === 'auto') return profile.logos;
    return LOGO_PRESETS[logoMode] || [];
}

async function addBorder(canvas, borderName, fabric, sizeConfig, themeConfig) {
    try {
        const border = await loadSvg(`/assets/borders/${borderName}.svg`, fabric);
        const borderInset = 12;
        const maxWidth = sizeConfig.width - (borderInset * 2);
        const maxHeight = sizeConfig.height - (borderInset * 2);
        
        fitObjectInto(border, maxWidth, maxHeight);
        tintObject(border, themeConfig.fg);
        
        border.set({
            left: sizeConfig.width / 2,
            top: sizeConfig.height / 2,
            originX: 'center',
            originY: 'center',
            selectable: false,
            evented: false
        });
        canvas.add(border);
        canvas.sendToBack(border);
    } catch (error) {
        console.warn(`Border failed to load: ${borderName}`);
    }
}

async function addLogoGroup(canvas, logoIds, box, fabric, themeConfig) {
    try {
        const logos = await Promise.all(logoIds.map((id) => loadSvg(`/assets/logos/${id}.svg`, fabric)));
        const gap = logos.length > 1 ? 18 : 0;
        const maxItemWidth = (box.width - (gap * (logos.length - 1))) / logos.length;

        logos.forEach((logo, index) => {
            const heightRatio = logos.length === 3 && index === 1 ? 1 : 0.86;
            fitObjectInto(logo, maxItemWidth, box.height * heightRatio);
            tintObject(logo, themeConfig.fg);
            logo.set({
                originX: 'center',
                originY: 'center',
                top: 0,
                selectable: false,
                evented: false
            });
        });

        const totalWidth = logos.reduce((sum, logo) => sum + logo.getScaledWidth(), 0) + (gap * (logos.length - 1));
        let cursor = -(totalWidth / 2);

        logos.forEach((logo) => {
            const logoWidth = logo.getScaledWidth();
            logo.set('left', cursor + (logoWidth / 2));
            cursor += logoWidth + gap;
        });

        const group = new fabric.Group(logos, {
            left: box.centerX,
            top: box.centerY,
            originX: 'center',
            originY: 'center',
            selectable: false,
            evented: false
        });

        fitObjectInto(group, box.width, box.height);
        group.set({
            left: box.centerX,
            top: box.centerY
        });
        canvas.add(group);
    } catch (error) {
        console.warn('Logo group failed');
    }
}

function addText(canvas, engine, profile, data, boxes, fabric, themeConfig) {
    const textOptions = {
        fill: themeConfig.fg,
        textAlign: 'center',
        textBaseline: 'alphabetic'
    };

    const name = new fabric.Text(data.mainName, {
        ...textOptions,
        fontFamily: profile.main
    });
    engine.fitTextObject(name, boxes.name, {
        maxFontSize: profile.nameMax,
        minFontSize: 24
    });
    canvas.add(name);

    if (data.address && boxes.sub) {
        const sub = new fabric.Text(data.address, {
            ...textOptions,
            fontFamily: profile.sub,
            fill: themeConfig.muted,
            charSpacing: 20
        });
        engine.fitTextObject(sub, boxes.sub, {
            maxFontSize: 36,
            minFontSize: 14
        });
        canvas.add(sub);
    }

    if (data.bottomLine && boxes.footer) {
        const footer = new fabric.Text(data.bottomLine, {
            ...textOptions,
            fontFamily: profile.sub,
            fill: themeConfig.muted,
            charSpacing: 30
        });
        engine.fitTextObject(footer, boxes.footer, {
            maxFontSize: 25,
            minFontSize: 12
        });
        canvas.add(footer);
    }
}

function fitObjectInto(object, maxWidth, maxHeight) {
    if (!object) return;
    
    object.set({ scaleX: 1, scaleY: 1 });
    
    // Use getScaledWidth/Height or fallback to width/height
    const objWidth = object.width || 1;
    const objHeight = object.height || 1;
    
    const scale = Math.min(maxWidth / objWidth, maxHeight / objHeight);
    
    object.set({
        scaleX: scale,
        scaleY: scale
    });
    
    if (object.setCoords) {
        object.setCoords();
    }
}

function tintObject(object, color) {
    if (object.set) {
        if (object.fill) object.set('fill', color);
        if (object.stroke && object.stroke !== 'none') object.set('stroke', color);
    }

    if (object.getObjects) {
        object.getObjects().forEach((child) => tintObject(child, color));
    }
}

async function loadSvg(url, fabric) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const svgText = await response.text();
    return new Promise((resolve, reject) => {
        fabric.loadSVGFromString(svgText, (objects, options) => {
            if (!objects || objects.length === 0) {
                reject(new Error(`Invalid SVG`));
                return;
            }
            const svgObject = fabric.util.groupSVGElements(objects, options);
            resolve(svgObject);
        });
    });
}
