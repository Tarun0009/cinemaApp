import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export const Collapsible = ({ title, children }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ marginVertical: 8 }}>
      <TouchableOpacity onPress={() => setOpen(!open)}>
        <Text style={{ color: "#fff", fontSize: 16 }}>
          {open ? "▼" : "►"} {title}
        </Text>
      </TouchableOpacity>
      {open && <View style={{ paddingLeft: 12 }}>{children}</View>}
    </View>
  );
};
