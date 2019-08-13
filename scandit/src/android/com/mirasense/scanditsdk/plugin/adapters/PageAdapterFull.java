package com.mirasense.scanditsdk.plugin.adapters;

import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;

import com.mirasense.scanditsdk.plugin.fragments.PendingProductsPickingStoresFull;
import com.mirasense.scanditsdk.plugin.fragments.ProcessedProductsPickingStoresFull;

public class PageAdapterFull extends FragmentPagerAdapter {

  private int tabsCount;
  private PendingProductsPickingStoresFull pendingFragment;
  private ProcessedProductsPickingStoresFull processedFragment;

  public PageAdapterFull(FragmentManager fm, int tabsCount) {
    super(fm);
    this.tabsCount = tabsCount;
  }

  @Override
  public Fragment getItem(int i) {
    switch (i) {
      case 0:
        pendingFragment = new PendingProductsPickingStoresFull();
        return pendingFragment;
      case 1:
        processedFragment = new ProcessedProductsPickingStoresFull();
        return processedFragment;
      default:
        return null;
    }
  }

  @Override
  public int getCount() {
    return this.tabsCount;
  }

  public PendingProductsPickingStoresFull getPendingFragment() {
    return pendingFragment;
  }

  public ProcessedProductsPickingStoresFull getProcessedFragment() {
    return processedFragment;
  }

}
