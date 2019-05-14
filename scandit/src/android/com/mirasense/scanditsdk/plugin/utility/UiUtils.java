package com.mirasense.scanditsdk.plugin.utility;

import android.content.Context;

public final class UiUtils {

    private UiUtils() {}

    public static int pxFromDp(Context context, int dp) {
        return (int) (dp * context.getResources().getDisplayMetrics().density + 0.5f);
    }
}
