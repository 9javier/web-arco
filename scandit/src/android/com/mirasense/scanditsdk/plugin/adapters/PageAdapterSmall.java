package com.mirasense.scanditsdk.plugin.adapters;

import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;

import com.mirasense.scanditsdk.plugin.fragments.PendingProductsPickingStores;
import com.mirasense.scanditsdk.plugin.fragments.ProcessedProductsPickingStores;

public class PageAdapterSmall extends FragmentPagerAdapter {

  private int tabsCount;
  private PendingProductsPickingStores pendingFragment;
  private ProcessedProductsPickingStores processedFragment;

  public PageAdapterSmall(FragmentManager fm, int tabsCount) {
    super(fm);
    this.tabsCount = tabsCount;
  }

  @Override
  public Fragment getItem(int i) {
    switch (i) {
      case 0:
        pendingFragment = new PendingProductsPickingStores();
        return pendingFragment;
      case 1:
        processedFragment = new ProcessedProductsPickingStores();
        return processedFragment;
      default:
        return null;
    }
  }

  @Override
  public int getCount() {
    return this.tabsCount;
  }

  public PendingProductsPickingStores getPendingFragment() {
    return pendingFragment;
  }

  public ProcessedProductsPickingStores getProcessedFragment() {
    return processedFragment;
  }

}
