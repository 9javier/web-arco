package com.mirasense.scanditsdk.plugin.adapters;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Typeface;
import android.support.v4.content.ContextCompat;
import android.support.v4.view.MotionEventCompat;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import com.mirasense.scanditsdk.plugin.models.KeyPairBoolData;
import com.mirasense.scanditsdk.plugin.utility.DragItemTouchHelper;

import java.util.ArrayList;
import java.util.Collections;

public class SortItemsAdapter extends RecyclerView.Adapter<SortItemsAdapter.SortViewHolder> implements DragItemTouchHelper.MoveHelperAdapter {

  ArrayList<KeyPairBoolData> arrayList;
  ArrayList<KeyPairBoolData> mOriginalValues;
  LayoutInflater inflater;
  Resources resources;
  String package_name;
  Context context;
  private int selected = 0;

  private static final int SORT_TYPE_NONE = 1;
  private static final int SORT_TYPE_ASC = 2;
  private static final int SORT_TYPE_DESC = 3;

  public SortItemsAdapter(Context context, ArrayList<KeyPairBoolData> arrayList, Resources resources, String package_name) {
    this.context = context;
    this.arrayList = arrayList;
    this.mOriginalValues = arrayList;
    inflater = LayoutInflater.from(context);
    this.resources = resources;
    this.package_name = package_name;
  }

  private OnItemClickListener mOnItemClickListener;
  private OnStartDragListener mDragStartListener = null;

  public interface OnItemClickListener {
    void onItemClick(View view, String obj, int position);
  }

  public interface OnStartDragListener {
    void onStartDrag(RecyclerView.ViewHolder viewHolder);
  }

  public void setDragListener(OnStartDragListener dragStartListener) {
    this.mDragStartListener = dragStartListener;
  }

  @Override
  public SortItemsAdapter.SortViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
    View v = LayoutInflater.from(parent.getContext()).inflate(resources.getIdentifier("item_spinner_sort", "layout", package_name), parent, false);
    SortItemsAdapter.SortViewHolder pvh = new SortItemsAdapter.SortViewHolder(v);
    return pvh;
  }

  @Override
  public void onBindViewHolder(SortItemsAdapter.SortViewHolder holder, int position) {
    final KeyPairBoolData data = arrayList.get(position);

    holder.tvItemSpinnerSort.setText(data.getName());
    holder.tvItemSpinnerSort.setTypeface(null, Typeface.NORMAL);

    if (data.getTypeSort() == SORT_TYPE_NONE) {
      holder.tvSortTypeSelected.setVisibility(View.GONE);
      holder.tvSortTypeSelected.setText("");
      holder.ivSortTypeNoSelected.setVisibility(View.VISIBLE);
    } else if (data.getTypeSort() == SORT_TYPE_ASC) {
      holder.ivSortTypeNoSelected.setVisibility(View.GONE);
      holder.tvSortTypeSelected.setVisibility(View.VISIBLE);
      holder.tvSortTypeSelected.setText("ASC.");
    } else {
      holder.ivSortTypeNoSelected.setVisibility(View.GONE);
      holder.tvSortTypeSelected.setVisibility(View.VISIBLE);
      holder.tvSortTypeSelected.setText("DESC.");
    }

    holder.ibSort.setOnTouchListener((v, event) -> {
      if (MotionEventCompat.getActionMasked(event) == MotionEvent.ACTION_DOWN && mDragStartListener != null) {
        mDragStartListener.onStartDrag(holder);
      }
      return false;
    });

    holder.itemView.setOnClickListener(view -> {
      if (data.getTypeSort() == SORT_TYPE_NONE) {
        data.setTypeSort(SORT_TYPE_ASC);
      } else if (data.getTypeSort() == SORT_TYPE_ASC) {
        data.setTypeSort(SORT_TYPE_DESC);
      } else {
        data.setTypeSort(SORT_TYPE_NONE);
      }

      notifyDataSetChanged();
    });
  }

  @Override
  public long getItemId(int position) {
    return position;
  }

  @Override
  public int getItemCount() {
    return arrayList.size();
  }

  public ArrayList<KeyPairBoolData> getAllItems() {
    return arrayList;
  }

  public ArrayList<KeyPairBoolData> getSelectedItems() {
    ArrayList<KeyPairBoolData> selectedItems = new ArrayList<>();
    for (KeyPairBoolData item : arrayList) {
      if (item.getTypeSort() != SORT_TYPE_NONE) {
        selectedItems.add(item);
      }
    }
    return selectedItems;
  }

  public ArrayList<Long> getSelectedIds() {
    ArrayList<Long> selectedItemsIds = new ArrayList<>();
    for (KeyPairBoolData item : arrayList) {
      if (item.isSelected()) {
        selectedItemsIds.add(item.getId());
      }
    }
    return selectedItemsIds;
  }

  @Override
  public boolean onItemMove(int fromPosition, int toPosition) {
    Collections.swap(arrayList, fromPosition, toPosition);
    notifyItemMoved(fromPosition, toPosition);
    return true;
  }

  public class SortViewHolder extends RecyclerView.ViewHolder implements DragItemTouchHelper.TouchViewHolder {
    View itemView;
    TextView tvItemSpinnerSort;
    TextView tvSortTypeSelected;
    ImageButton ibSort;
    ImageView ivSortTypeNoSelected;

    int idTvItemSpinnerSort;
    int idTvSortTypeSelected;
    int idIbSort;
    int idIvSortTypeNoSelected;

    public SortViewHolder(View itemView) {
      super(itemView);
      this.itemView = itemView;

      this.idTvItemSpinnerSort = resources.getIdentifier("tvItemSpinnerSort", "id", package_name);
      this.idTvSortTypeSelected = resources.getIdentifier("tvSortTypeSelected", "id", package_name);
      this.idIbSort = resources.getIdentifier("ibSort", "id", package_name);
      this.idIvSortTypeNoSelected = resources.getIdentifier("ivSortTypeNoSelected", "id", package_name);

      this.tvItemSpinnerSort = itemView.findViewById(this.idTvItemSpinnerSort);
      this.tvSortTypeSelected = itemView.findViewById(this.idTvSortTypeSelected);
      this.ibSort = itemView.findViewById(this.idIbSort);
      this.ivSortTypeNoSelected = itemView.findViewById(this.idIvSortTypeNoSelected);
    }

    @Override
    public void onItemSelected() {

    }

    @Override
    public void onItemClear() {
      itemView.setBackgroundColor(0);
    }
  }
}
