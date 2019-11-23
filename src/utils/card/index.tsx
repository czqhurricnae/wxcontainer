import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { IProps } from "./card";
import { BG_COLOR_LIST } from "../model";

import "./index.scss";
import { classNames } from "../index";
import ClText from "../text";

export default function ClCard(props: IProps) {
  const typeClassName = props.type === "full" ? "no-card" : "";
  const colorClassName = props.bgColor
    ? BG_COLOR_LIST[props.bgColor]
    : "bg-white";
  return (
    <View
      className={classNames([`cu-card case ${typeClassName}`], props.className)}
      style={Object.assign({}, props.style)}
    >
      <View
        className={classNames([
          "cu-item",
          {
            shadow: props.shadow
          },
          colorClassName,
          {
            cu_card_active: props.active
          }
        ])}
      >
        {props.title && props.title.text ? (
          <View className="cu_card__title-line padding">
            <ClText {...props.title}></ClText>
          </View>
        ) : (
          ""
        )}
        <View className="padding">{this.props.children}</View>
      </View>
    </View>
  );
}

ClCard.options = {
  addGlobalClass: true
};

ClCard.defaultProps = {
  type: "card",
  bgColor: "white",
  shadow: true,
  active: false,
  title: {}
} as IProps;
