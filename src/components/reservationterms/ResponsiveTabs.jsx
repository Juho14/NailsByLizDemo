import { Tab, Tabs, useMediaQuery, useTheme } from '@mui/material';
import React, { useState } from 'react';
import DesktopTabPanel from './DesktopTabPanel';
import MobileTabPanel from './MobileTabPanel';
import { tabContent } from './TabContent';

export default function ResponsiveTabs() {
    const [value, setValue] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <Tabs value={value} onChange={handleChange} aria-label="responsive tabs">
                {tabContent.map((tab, index) => (
                    <Tab key={index} label={tab.label} />
                ))}
            </Tabs>
            {isMobile ? (
                <div>
                    {tabContent.map((tab, index) => (
                        <MobileTabPanel key={index} value={value} index={index} label={tab.label}>
                            {tab.content}
                        </MobileTabPanel>
                    ))}
                </div>
            ) : (
                <div>
                    {tabContent.map((tab, index) => (
                        <DesktopTabPanel key={index} value={value} index={index}>
                            {tab.content}
                        </DesktopTabPanel>
                    ))}
                </div>
            )}
        </div>
    );
}
