import React, {useContext} from "react";
import {Radio} from "@arco-design/web-react";
import styled from "styled-components";
import {GlobalContext} from "../Context";

export const SettingsPage = () => {
  const {settings, setSettings} = useContext(GlobalContext);

  const handleUpdate = (v: any) => {
    setSettings((s) => {
      return {...s, testMethod: v};
    });
  };

  return (
    <div className="scroll-bfc white-background">
      <div className="flex-col node-page">
        <div className="page-title">设置</div>
        <div style={{display: "flex", padding: "2rem"}}>
          <SettingItem>
            <SettingLabel>检测方法设置</SettingLabel>
            <SettingOption>
              <Radio.Group
                defaultValue={settings.testMethod}
                onChange={handleUpdate}
                type="button"
                size="large"
              >
                <Radio value="th">阈值检测</Radio>
                <Radio value="ml">机器学习</Radio>
                <Radio value="mk">Mann-Kendall 检验</Radio>
              </Radio.Group>
            </SettingOption>
          </SettingItem>
        </div>
      </div>
    </div>
  );
};

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--text);
  font-size: 1.2rem;
  align-items: center;
`;
const SettingLabel = styled.div`
  font-weight: bold;
  margin-right: 2rem;
`;
const SettingOption = styled.div``;
